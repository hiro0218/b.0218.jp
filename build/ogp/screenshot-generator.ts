import cluster from 'node:cluster';
import { readdir } from 'node:fs/promises';

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

    const allPosts = getPostsListJson();

    if (allPosts.length === 0) {
      Log.info('OGP Generation', 'No posts to process');
      return;
    }

    const posts = OGP_CONFIG.force ? allPosts : await this.filterNewPosts(allPosts);

    if (posts.length === 0) {
      Log.info('OGP Generation', `All ${allPosts.length} posts already have OGP images, skipping`);
      return;
    }

    const skipped = allPosts.length - posts.length;
    if (skipped > 0) {
      Log.info('OGP Generation', `Skipping ${skipped} posts with existing images, generating ${posts.length}`);
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

  private async filterNewPosts(posts: { slug: string }[]): Promise<{ slug: string }[]> {
    const existingFiles = await readdir(OGP_CONFIG.output.dir).catch(() => [] as string[]);
    const existingSet = new Set(existingFiles);

    return posts.filter((post) => !existingSet.has(`${post.slug}.${OGP_CONFIG.output.ext}`));
  }
}
