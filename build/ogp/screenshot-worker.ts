import { type Browser, chromium, type Page } from 'playwright-chromium';

import * as Log from '~/tools/logger';

import { OGP_CONFIG } from './config';
import type { Post, WorkerMessage, WorkerTaskMessage } from './types';

let browser: Browser | null = null;
const pagePool: Page[] = [];

process.on('message', async (msg: WorkerTaskMessage) => {
  if (msg.type === 'posts' && Array.isArray(msg.posts)) {
    try {
      await processImages(msg.posts);
    } catch (err) {
      const message: WorkerMessage = {
        type: 'error',
        error: err instanceof Error ? err.message : String(err),
      };
      process.send?.(message);
    } finally {
      await cleanup();
      process.exit(0);
    }
  }
});

async function setTitleAndWaitForFonts(page: Page, title: string): Promise<void> {
  await page.evaluate(
    async ({ title, fontWaitTimeout, fontCheckInterval }) => {
      document.getElementById('title')!.textContent = title;

      if (document.fonts.check('900 56px "Noto Sans JP"')) {
        return;
      }

      const startTime = Date.now();
      while (Date.now() - startTime < fontWaitTimeout) {
        if (document.fonts.check('900 56px "Noto Sans JP"')) {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, fontCheckInterval));
      }

      await document.fonts.ready;
    },
    {
      title,
      fontWaitTimeout: OGP_CONFIG.screenshot.fontWaitTimeout,
      fontCheckInterval: OGP_CONFIG.screenshot.fontCheckInterval,
    },
  );
}

async function processImages(posts: Post[]): Promise<void> {
  const serverUrl = `${OGP_CONFIG.server.host}:${OGP_CONFIG.server.port}/`;
  const failedSlugs: string[] = [];

  browser = await chromium.launch({
    args: [...OGP_CONFIG.screenshot.chromiumArgs],
    handleSIGINT: false,
  });

  await initializePagePool(serverUrl);

  const semaphore = new Array(OGP_CONFIG.worker.pagesPerWorker).fill(false);
  let completed = 0;
  let index = 0;

  const acquirePage = async (): Promise<{ page: Page; index: number }> => {
    while (true) {
      for (let i = 0; i < semaphore.length; i++) {
        if (!semaphore[i]) {
          semaphore[i] = true;
          return { page: pagePool[i], index: i };
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  };

  const releasePage = (index: number): void => {
    semaphore[index] = false;
  };

  const processQueue = async () => {
    if (index >= posts.length) return;

    const currentIndex = index++;
    const post = posts[currentIndex];

    const { page, index: pageIndex } = await acquirePage();

    try {
      await captureScreenshot(page, post);
      completed++;

      const message: WorkerMessage = { type: 'completed', index: currentIndex };
      process.send?.(message);
    } catch (err) {
      await handlePageError(page, pageIndex, serverUrl);
      failedSlugs.push(post.slug);

      const message: WorkerMessage = {
        type: 'error',
        error: `Error processing ${post.slug}: ${err instanceof Error ? err.message : String(err)}`,
      };
      process.send?.(message);
      completed++;
    } finally {
      releasePage(pageIndex);
      processQueue();
    }
  };

  const batchSize = Math.min(posts.length, OGP_CONFIG.worker.pagesPerWorker * 3);
  const initialTasks = Math.min(batchSize, posts.length);

  for (let i = 0; i < initialTasks; i++) {
    processQueue();
  }

  while (completed < posts.length) {
    await new Promise((resolve) => setTimeout(resolve, OGP_CONFIG.screenshot.completionCheckInterval));
  }

  const summaryMessage: WorkerMessage = { type: 'summary', failed: failedSlugs };
  process.send?.(summaryMessage);
}

async function initializePagePool(serverUrl: string): Promise<void> {
  if (!browser) throw new Error('Browser not initialized');

  for (let i = 0; i < OGP_CONFIG.worker.pagesPerWorker; i++) {
    const page = await browser.newPage({
      bypassCSP: true,
      viewport: OGP_CONFIG.screenshot.viewport,
    });

    await page.goto(serverUrl, {
      waitUntil: 'domcontentloaded',
      timeout: OGP_CONFIG.screenshot.pageGotoTimeout,
    });

    await setTitleAndWaitForFonts(page, 'Cache Warming');
    pagePool.push(page);
  }
}

async function captureScreenshot(page: Page, post: Post): Promise<void> {
  const { title, slug } = post;

  await setTitleAndWaitForFonts(page, title);

  await page.screenshot({
    fullPage: false,
    path: `${OGP_CONFIG.output.dir}/${slug}.${OGP_CONFIG.output.ext}`,
    type: OGP_CONFIG.output.format,
    quality: OGP_CONFIG.output.quality,
  });
}

async function handlePageError(page: Page, pageIndex: number, serverUrl: string): Promise<void> {
  try {
    await page.reload({ timeout: OGP_CONFIG.screenshot.pageReloadTimeout });
  } catch {
    if (!browser) return;

    try {
      const newPage = await browser.newPage({
        bypassCSP: true,
        viewport: OGP_CONFIG.screenshot.viewport,
      });

      await newPage.goto(serverUrl, {
        waitUntil: 'domcontentloaded',
        timeout: OGP_CONFIG.screenshot.pageGotoTimeout,
      });

      pagePool[pageIndex] = newPage;
      await page.close();
    } catch (err) {
      Log.error('Page Recovery', `Failed to recover page: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

async function cleanup(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
