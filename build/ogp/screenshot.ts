import cluster from 'node:cluster';
import os from 'node:os';
import { cwd } from 'node:process';
import { type Browser, chromium, type Page } from 'playwright-chromium';

import { getPostsListJson } from '@/lib/posts';
import { mkdir } from '~/tools/fs';
import * as Log from '~/tools/logger';

type Post = { title: string; slug: string };
type WorkerMessage = { type: 'completed'; index?: number } | { type: 'error'; error: string };

type WorkerTaskMessage = { type: 'posts'; posts: Post[] };

const HOST = 'http://localhost:3000/';
const PAGE_GOTO_OPTIONS = { waitUntil: 'domcontentloaded', timeout: 10000 } as const;
const path = {
  dist: `${cwd()}/public/images/ogp`,
};

// マルチプロセスとマルチスレッドの両方を活用
const WORKER_COUNT = Math.min(os.cpus().length, 4); // Workerプロセス数
const PAGES_PER_WORKER = Math.min(Math.ceil(os.cpus().length / WORKER_COUNT) * 2, 8); // Workerあたりのページ数

// メインプロセスの場合
if (cluster.isPrimary) {
  (async () => {
    await mkdir(path.dist, { recursive: true });
    const posts = getPostsListJson();
    const length = posts.length;

    Log.info(
      'Starting OGP Generation',
      `Total: ${length}, Workers: ${WORKER_COUNT}, Pages per worker: ${PAGES_PER_WORKER}`,
    );

    // タスクを各Workerに分散
    const postsPerWorker = Math.ceil(length / WORKER_COUNT);
    const worker = cluster.worker;
    const workers: { worker: typeof worker; posts: typeof posts; completed: number }[] = [];

    // Workerの起動とタスク割り当て
    for (let i = 0; i < WORKER_COUNT; i++) {
      const start = i * postsPerWorker;
      const end = Math.min(start + postsPerWorker, length);
      const workerPosts = posts.slice(start, end);

      const worker = cluster.fork();
      workers.push({ worker, posts: workerPosts, completed: 0 });

      // Workerからのメッセージ処理
      worker.on('message', (msg: WorkerMessage) => {
        const workerInfo = workers.find((w) => w.worker === worker);

        if (msg.type === 'completed' && typeof msg.index === 'number') {
          if (workerInfo) {
            workerInfo.completed++;

            // 進捗状況の報告
            const totalCompleted = workers.reduce((sum, w) => sum + w.completed, 0);
            if (totalCompleted === 1 || totalCompleted % 100 === 0 || totalCompleted === length) {
              Log.info('Generating OGP Images', `(${totalCompleted}/${length})`);
            }
          }
        } else if (msg.type === 'error') {
          Log.error('Worker Error', msg.error || 'Unknown error');
        }
      });

      // タスク割り当て
      worker.send({ type: 'posts', posts: workerPosts });
    }

    // すべてのWorkerの完了を待機
    process.on('exit', () => {
      workers.forEach(({ worker }) => {
        worker.kill();
      });
    });

    cluster.on('exit', (worker, code) => {
      const workerInfo = workers.find((w) => w.worker === worker);
      if (workerInfo) {
        const remaining = workerInfo.posts.length - workerInfo.completed;
        if (remaining > 0) {
          Log.warn(`Worker exited with code ${code}, ${remaining} tasks incomplete`);
        }
      }

      // すべてのWorkerが終了したか確認
      if (workers.every((w) => !w.worker.isConnected())) {
        Log.info('OGP Images Generation', 'All workers completed');
        process.exit(0);
      }
    });
  })();
}
// Workerプロセスの場合
else {
  let browser: Browser | null = null;
  const pagePool: Page[] = [];

  // Worker内でスクリーンショットを処理
  process.on('message', async (msg: WorkerTaskMessage) => {
    if (msg.type === 'posts' && Array.isArray(msg.posts)) {
      try {
        await processImages(msg.posts);
      } catch (err) {
        process.send?.({ type: 'error', error: err.toString() });
      } finally {
        if (browser) {
          await browser.close();
        }
        process.exit(0);
      }
    }
  });

  async function processImages(posts: Post[]): Promise<void> {
    try {
      // 軽量化されたブラウザ設定
      browser = await chromium.launch({
        args: [
          '--disable-extensions',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--js-flags=--expose-gc',
        ],
        handleSIGINT: false,
      });

      // ページプールの初期化
      for (let i = 0; i < PAGES_PER_WORKER; i++) {
        const page = await browser.newPage({
          bypassCSP: true, // CSPを無視して高速化
          viewport: { width: 1200, height: 630 },
        });

        // 初期ページ読み込み
        await page.goto(HOST, PAGE_GOTO_OPTIONS);

        // キャッシュを温めるために初期レンダリング
        await page.evaluate(() => {
          document.getElementById('title').innerHTML = 'Cache Warming';
        });

        pagePool.push(page);
      }

      // 並列処理用のセマフォ
      const semaphore = new Array(PAGES_PER_WORKER).fill(false);

      // 利用可能なページを取得
      const acquirePage = async (): Promise<{ page: Page; index: number }> => {
        while (true) {
          const index = semaphore.findIndex((inUse) => !inUse);
          if (index >= 0) {
            semaphore[index] = true;
            return { page: pagePool[index], index };
          }
          // 少し待機して再試行
          await new Promise((r) => setTimeout(r, 10));
        }
      };

      // ページを解放
      const releasePage = (index: number): void => {
        semaphore[index] = false;
      };

      // バッチ処理用のプールサイズ
      const batchSize = Math.min(posts.length, PAGES_PER_WORKER * 3);
      // biome-ignore lint/correctness/noUnusedVariables: バッチ処理の同時実行数を追跡するために使用
      let active = 0;
      let completed = 0;
      let index = 0;

      // キューを処理する関数
      const processQueue = async () => {
        if (index >= posts.length) return;

        active++;
        const currentIndex = index++;
        const post = posts[currentIndex];

        // ページを取得
        const { page, index: pageIndex } = await acquirePage();

        try {
          const { title, slug } = post;
          const pageTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

          // 高速なDOM更新
          await page.evaluate(async (title) => {
            document.getElementById('title').innerHTML = title;
            // フォント読み込みの最適化
            const fontPromise = document.fonts.ready;
            const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 250));
            await Promise.race([fontPromise, timeoutPromise]);
          }, pageTitle);

          await page.screenshot({
            fullPage: false,
            path: `${path.dist}/${slug}.jpg`,
            type: 'jpeg',
          });

          completed++;
          process.send?.({ type: 'completed', index: currentIndex });
        } catch (err) {
          // エラー処理 - ページをリセット
          try {
            await page.reload({ timeout: 5000 });
          } catch (_) {
            // リロードに失敗した場合、新しいページを作成
            try {
              await page.close();
              pagePool[pageIndex] = await browser.newPage({
                bypassCSP: true,
                viewport: { width: 1200, height: 630 },
              });
              await pagePool[pageIndex].goto(HOST, PAGE_GOTO_OPTIONS);
            } catch (newPageErr) {
              console.error('Failed to create new page:', newPageErr);
            }
          }

          process.send?.({ type: 'error', error: `Error processing ${post.slug}: ${err.toString()}` });
        } finally {
          // ページを解放して次のタスクを開始
          releasePage(pageIndex);
          active--;

          // 次の処理を開始
          processQueue();
        }
      };

      // 初期バッチを開始
      const initialTasks = Math.min(batchSize, posts.length);
      for (let i = 0; i < initialTasks; i++) {
        processQueue();
      }

      // すべての処理が完了するまで待機
      while (completed < posts.length) {
        await new Promise((r) => setTimeout(r, 100));
      }
    } catch (err) {
      process.send?.({ type: 'error', error: `Worker error: ${err.toString()}` });
    }
  }
}
