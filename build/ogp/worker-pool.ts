import cluster from 'node:cluster';
import { join } from 'node:path';

import * as Log from '~/tools/logger';

import { OGP_CONFIG } from './config';

type Post = { title: string; slug: string };
type WorkerMessage = { type: 'completed'; index?: number } | { type: 'error'; error: string };
type WorkerTaskMessage = { type: 'posts'; posts: Post[] };

interface WorkerInfo {
  worker: NonNullable<ReturnType<typeof cluster.fork>>;
  posts: Post[];
  completed: number;
}

export class WorkerPool {
  private workers: WorkerInfo[] = [];
  private totalPosts: number = 0;

  async start(posts: Post[]): Promise<void> {
    this.totalPosts = posts.length;
    const workerCount = OGP_CONFIG.worker.count;

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
        Log.error('Worker Error', msg.error || 'Unknown error');
      }
    });
  }

  private async waitForCompletion(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let hasError = false;
      const errors: string[] = [];

      const checkCompletion = (worker: NonNullable<ReturnType<typeof cluster.fork>>, code: number) => {
        const workerInfo = this.workers.find((w) => w.worker === worker);

        if (code !== 0) {
          hasError = true;
          const remaining = workerInfo ? workerInfo.posts.length - workerInfo.completed : 0;
          const errorMsg = `Worker exited with code ${code}, ${remaining} tasks incomplete`;
          errors.push(errorMsg);
          Log.error('Worker Pool', errorMsg);
        }

        if (this.workers.every((w) => !w.worker.isConnected())) {
          if (hasError) {
            reject(new Error(`Worker failures:\n${errors.join('\n')}`));
          } else {
            Log.info('OGP Images Generation', 'All workers completed');
            resolve();
          }
        }
      };

      cluster.on('exit', checkCompletion);
    });
  }
}
