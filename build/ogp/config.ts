import * as os from 'node:os';
import { cwd } from 'node:process';

function validateConfig(config: typeof OGP_CONFIG): void {
  if (config.worker.count <= 0) {
    throw new Error('OGP_WORKERS must be a positive integer');
  }

  if (config.worker.pagesPerWorker <= 0) {
    throw new Error('OGP_PAGES_PER_WORKER must be a positive integer');
  }
}

export const OGP_CONFIG = {
  server: {
    host: 'http://localhost',
    port: 3000,
    readyTimeout: 30000,
    readyCheckInterval: 500,
    healthCheckTimeout: 2000,
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
    ext: 'jpg' as const,
    quality: 85,
  },
  force: process.env.OGP_FORCE === 'true',
  debug: process.env.DEBUG === 'true',
} as const;

validateConfig(OGP_CONFIG);
