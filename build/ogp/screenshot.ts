import cluster from 'node:cluster';
import os from 'node:os';
import { cwd } from 'node:process';
import { type Browser, chromium, type Page } from 'playwright-chromium';

import { getPostsListJson } from '@/lib/posts';
import { mkdir } from '@/shared/fs';
import * as Log from '@/shared/Log';

type Post = { title: string; slug: string };
type WorkerMessage = { type: 'completed'; index?: number } | { type: 'error'; error: string };

type WorkerTaskMessage = { type: 'posts'; posts: Post[] };

const HOST = 'http://localhost:3000/';
const PAGE_GOTO_OPTIONS = { waitUntil: 'domcontentloaded', timeout: 10000 } as const;
const path = {
  dist: `${cwd()}/public/images/ogp`,
};

/**
 * Promiseベースのセマフォ実装
 * 複数の非同期リソース（ページ）への同時アクセス数を制御する
 */
class PromiseSemaphore {
  private queue: Array<() => void> = [];
  private available: number;
  constructor(count: number) {
    this.available = count;
  }
  async acquire(): Promise<() => void> {
    if (this.available > 0) {
      this.available--;
      return this.release.bind(this);
    }
    return new Promise((resolve) => {
      this.queue.push(() => {
        this.available--;
        resolve(this.release.bind(this));
      });
    });
  }
  private release(): void {
    this.available++;
    const next = this.queue.shift();
    if (next) next();
  }
}

/**
 * CI環境かどうかを判定する
 * - 一般的なCIサービスの環境変数を網羅的にチェック
 */
function isCIEnvironment(): boolean {
  return Boolean(
    process.env.GITHUB_ACTIONS ||
      process.env.GITLAB_CI ||
      process.env.CI ||
      process.env.VERCEL === '1' ||
      process.env.VERCEL === 'true',
  );
}

/**
 * 実行環境に応じて最適なワーカー数を返す
 * - CI環境や物理コア数、メモリ量を考慮
 * - デフォルトは2、最大は論理CPU数の半分または4まで
 */
function getOptimalWorkerCount(): number {
  const cpuCount = os.cpus().length;
  const memGB = os.totalmem() / 1024 ** 3;
  // CI環境では2コア/7GB程度
  if (isCIEnvironment()) {
    if (memGB < 4) return 1;
    if (cpuCount >= 4 && memGB >= 7) return 2;
    return 1;
  }
  // ローカルや大容量サーバーでは最大4まで
  return Math.max(1, Math.min(4, Math.floor(cpuCount / 2)));
}

const WORKER_COUNT = getOptimalWorkerCount();
const PAGES_PER_WORKER = Math.min(Math.ceil(os.cpus().length / WORKER_COUNT) * 2, 8);

if (cluster.isPrimary) {
  (async () => {
    await mkdir(path.dist, { recursive: true });
    const posts = getPostsListJson();
    const length = posts.length;
    Log.info(
      'Starting OGP Generation',
      `Total: ${length}, Workers: ${WORKER_COUNT}, Pages per worker: ${PAGES_PER_WORKER}`,
    );
    const postsPerWorker = Math.ceil(length / WORKER_COUNT);
    const worker = cluster.worker;
    const workers: { worker: typeof worker; posts: typeof posts; completed: number }[] = [];
    for (let i = 0; i < WORKER_COUNT; i++) {
      const start = i * postsPerWorker;
      const end = Math.min(start + postsPerWorker, length);
      const workerPosts = posts.slice(start, end);
      const worker = cluster.fork();
      workers.push({ worker, posts: workerPosts, completed: 0 });
      worker.on('message', (msg: WorkerMessage) => {
        const workerInfo = workers.find((w) => w.worker === worker);
        if (msg.type === 'completed' && typeof msg.index === 'number') {
          if (workerInfo) {
            workerInfo.completed++;
            const totalCompleted = workers.reduce((sum, w) => sum + w.completed, 0);
            if (totalCompleted === 1 || totalCompleted % 100 === 0 || totalCompleted === length) {
              Log.info('Generating OGP Images', `(${totalCompleted}/${length})`);
            }
          }
        } else if (msg.type === 'error') {
          Log.error('Worker Error', msg.error || 'Unknown error');
        }
      });
      worker.send({ type: 'posts', posts: workerPosts });
    }
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
      if (workers.every((w) => !w.worker.isConnected())) {
        Log.info('OGP Images Generation', 'All workers completed');
        process.exit(0);
      }
    });
  })();
} else {
  let browser: Browser | null = null;
  const pagePool: Page[] = [];
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
      for (let i = 0; i < PAGES_PER_WORKER; i++) {
        const page = await browser.newPage({
          bypassCSP: true,
          viewport: { width: 1200, height: 630 },
        });
        await page.goto(HOST, PAGE_GOTO_OPTIONS);
        await page.evaluate(() => {
          document.getElementById('title').innerHTML = 'Cache Warming';
        });
        pagePool.push(page);
      }
      const semaphore = new PromiseSemaphore(PAGES_PER_WORKER);
      const chunkSize = 50;
      const chunkArray = <T>(arr: T[], size: number): T[][] => {
        const res: T[][] = [];
        for (let i = 0; i < arr.length; i += size) {
          res.push(arr.slice(i, i + size));
        }
        return res;
      };
      const chunks = chunkArray(posts, chunkSize);
      let completed = 0;
      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (post, i) => {
            const currentIndex = completed + i;
            const release = await semaphore.acquire();
            let page: Page | undefined;
            let pageIndex = -1;
            try {
              pageIndex = pagePool.findIndex((p) => !p.isClosed());
              if (pageIndex === -1) throw new Error('No available page');
              page = pagePool[pageIndex];
              const { title, slug } = post;
              const pageTitle = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
              await page.evaluate(async (title) => {
                document.getElementById('title').innerHTML = title;
                const fontPromise = document.fonts.ready;
                const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 250));
                await Promise.race([fontPromise, timeoutPromise]);
              }, pageTitle);
              await page.screenshot({
                fullPage: false,
                path: `${path.dist}/${slug}.jpg`,
                type: 'jpeg',
                quality: 90,
              });
              process.send?.({ type: 'completed', index: currentIndex });
            } catch (err) {
              try {
                if (page) await page.reload({ timeout: 5000 });
              } catch (_) {
                try {
                  if (page) await page.close();
                  pagePool[pageIndex] = await browser!.newPage({
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
              release();
            }
          }),
        );
        completed += chunk.length;
        if (global.gc) global.gc();
      }
    } catch (err) {
      process.send?.({ type: 'error', error: `Worker error: ${err.toString()}` });
    }
  }
}
