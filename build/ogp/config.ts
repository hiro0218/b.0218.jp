import os from 'node:os';
import { cwd } from 'node:process';

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
  output: {
    dir: `${cwd()}/public/images/ogp`,
    format: 'jpeg' as const,
    quality: 85,
  },
  debug: process.env.DEBUG === 'true',
} as const;
