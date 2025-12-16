import * as os from 'node:os';
import { cwd } from 'node:process';

function validateConfig(config: typeof OGP_CONFIG): void {
  if (config.server.port < 1024 || config.server.port > 65535) {
    throw new Error(`Invalid server port: ${config.server.port}. Must be between 1024 and 65535.`);
  }

  if (config.server.readyTimeout <= 0) {
    throw new Error('server.readyTimeout must be positive');
  }

  if (config.worker.count <= 0) {
    throw new Error('worker.count must be positive');
  }

  if (config.worker.pagesPerWorker <= 0) {
    throw new Error('worker.pagesPerWorker must be positive');
  }

  if (config.screenshot.pageGotoTimeout <= 0) {
    throw new Error('screenshot.pageGotoTimeout must be positive');
  }

  if (config.screenshot.viewport.width <= 0 || config.screenshot.viewport.height <= 0) {
    throw new Error('screenshot.viewport dimensions must be positive');
  }

  if (config.output.quality < 0 || config.output.quality > 100) {
    throw new Error(`Invalid output quality: ${config.output.quality}. Must be between 0 and 100.`);
  }
}

export const OGP_CONFIG = {
  server: {
    host: process.env.OGP_SERVER_HOST || 'http://localhost',
    port: Number.parseInt(process.env.OGP_SERVER_PORT || '3000', 10),
    readyTimeout: 30000,
    readyCheckInterval: 500,
    shutdownTimeout: 5000,
  },
  worker: {
    count: Math.min(os.cpus().length, Number.parseInt(process.env.OGP_WORKERS || '4', 10)),
    pagesPerWorker: Number.parseInt(process.env.OGP_PAGES_PER_WORKER || '8', 10),
  },
  screenshot: {
    pageGotoTimeout: 10000,
    fontWaitTimeout: 1000,
    fontCheckInterval: 50,
    pageReloadTimeout: 5000,
    completionCheckInterval: 100,
    viewport: { width: 1200, height: 630 },
    chromiumArgs: [
      '--disable-extensions',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--js-flags=--expose-gc',
    ],
  },
  output: {
    dir: `${cwd()}/public/images/ogp`,
    format: 'jpeg' as const,
    quality: 85,
  },
  debug: process.env.DEBUG === 'true',
} as const;

validateConfig(OGP_CONFIG);
