import cluster from 'node:cluster';
import { join } from 'node:path';

import * as Log from '~/tools/logger';

import { OGP_CONFIG } from './config';
import type { Post, WorkerMessage, WorkerTaskMessage } from './types';

interface WorkerInfo {
  worker: NonNullable<ReturnType<typeof cluster.fork>>;
  posts: Post[];
  completed: number;
}

export class WorkerPool {
  private workers: WorkerInfo[] = [];
  private totalPosts: number = 0;
  private failedPosts: Array<{ slug: string; error: string }> = [];

  async start(posts: Post[]): Promise<void> {
    this.totalPosts = posts.length;
    const workerCount = Math.min(OGP_CONFIG.worker.count, posts.length);

    Log.info(
      'Starting OGP Generation',
      `Total: ${this.totalPosts}, Workers: ${workerCount}, Pages per worker: ${OGP_CONFIG.worker.pagesPerWorker}`,
    );

    const postsPerWorker = Math.ceil(this.totalPosts / workerCount);

    for (let i = 0; i < workerCount; i++) {
      const start = i * postsPerWorker;
      const end = Math.min(start + postsPerWorker, this.totalPosts);
      const workerPosts = posts.slice(start, end);

      const worker = cluster.fork({
        // biome-ignore lint/style/useNamingConvention: environment variable
        WORKER_SCRIPT: join(__dirname, 'screenshot-worker.ts'),
      });

      const workerInfo: WorkerInfo = {
        worker,
        posts: workerPosts,
        completed: 0,
      };

      this.workers.push(workerInfo);
      this.attachWorkerListeners(workerInfo);

      const message: WorkerTaskMessage = { type: 'posts', posts: workerPosts };
      worker.send(message);
    }

    await this.waitForCompletion();

    if (this.failedPosts.length > 0) {
      Log.warn(
        'OGP Generation Summary',
        `${this.failedPosts.length} post(s) failed:\n${this.failedPosts.map((f) => `  - ${f.slug}: ${f.error}`).join('\n')}`,
      );
    }
  }

  async stop(): Promise<void> {
    for (const { worker } of this.workers) {
      if (worker.isConnected()) {
        worker.kill('SIGTERM');
      }
    }

    this.workers = [];
  }

  private attachWorkerListeners(workerInfo: WorkerInfo): void {
    const { worker } = workerInfo;

    worker.on('message', (msg: WorkerMessage) => {
      if (msg.type === 'completed' && typeof msg.index === 'number') {
        workerInfo.completed++;

        const totalCompleted = this.workers.reduce((sum, w) => sum + w.completed, 0);
        if (totalCompleted === 1 || totalCompleted % 100 === 0 || totalCompleted === this.totalPosts) {
          Log.info('Generating OGP Images', `(${totalCompleted}/${this.totalPosts})`);
        }
      } else if (msg.type === 'error') {
        Log.error('Worker Error', `${msg.slug || 'unknown'}: ${msg.error}`);

        if (msg.slug) {
          this.failedPosts.push({ slug: msg.slug, error: msg.error });
        }
      } else if (msg.type === 'summary' && msg.failed.length > 0) {
        for (const slug of msg.failed) {
          if (!this.failedPosts.some((f) => f.slug === slug)) {
            this.failedPosts.push({ slug, error: 'Failed (reported by worker)' });
          }
        }
      }
    });
  }

  private async waitForCompletion(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let hasError = false;
      const errors: string[] = [];

      const handleWorkerExit = (worker: NonNullable<ReturnType<typeof cluster.fork>>, code: number) => {
        const workerInfo = this.workers.find((w) => w.worker === worker);

        if (code !== 0) {
          hasError = true;
          const remaining = workerInfo ? workerInfo.posts.length - workerInfo.completed : 0;
          const errorMsg = `Worker exited with code ${code}, ${remaining} tasks incomplete`;
          errors.push(errorMsg);
          Log.error('Worker Pool', errorMsg);
        }

        if (this.workers.every((w) => !w.worker.isConnected())) {
          cluster.removeListener('exit', handleWorkerExit);

          if (hasError) {
            reject(new Error(`Worker failures:\n${errors.join('\n')}`));
          } else {
            Log.info('OGP Images Generation', 'All workers completed');
            resolve();
          }
        }
      };

      cluster.on('exit', handleWorkerExit);
    });
  }
}
