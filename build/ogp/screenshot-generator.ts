import cluster from 'node:cluster';

import { getPostsListJson } from '@/lib/data/posts';
import { mkdir } from '~/tools/fs';
import * as Log from '~/tools/logger';

import { OGP_CONFIG } from './config';
import { WorkerPool } from './worker-pool';

export class ScreenshotGenerator {
  private workerPool: WorkerPool | null = null;

  async generate(): Promise<void> {
    if (!cluster.isPrimary) {
      throw new Error('ScreenshotGenerator must run in primary process');
    }

    await mkdir(OGP_CONFIG.output.dir, { recursive: true });

    const posts = getPostsListJson();

    if (posts.length === 0) {
      Log.info('OGP Generation', 'No posts to process');
      return;
    }

    this.workerPool = new WorkerPool();

    try {
      await this.workerPool.start(posts);
      Log.info('OGP Generation', 'Screenshot generation completed successfully');
    } catch (error) {
      if (error instanceof Error) {
        Log.error('OGP Generation', `Failed: ${error.message}`);
        if (OGP_CONFIG.debug && error.stack) {
          console.error('Stack trace:', error.stack);
        }
      } else {
        Log.error('OGP Generation', `Failed: ${String(error)}`);
      }
      throw error;
    } finally {
      await this.stop();
    }
  }

  async stop(): Promise<void> {
    if (this.workerPool) {
      await this.workerPool.stop();
      this.workerPool = null;
    }
  }
}
