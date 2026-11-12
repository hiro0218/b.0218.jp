import cluster from 'node:cluster';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

import { FILENAME_POSTS_LIST } from '@/constants';
import type { PostSummary } from '@/types/source';
import { mkdir, readJSON } from '~/build/shared/fs';
import * as Log from '~/build/shared/logger';
import { BUILD_PATHS } from '~/build/shared/paths';

import { OGP_CONFIG } from './config';
import { WorkerPool } from './worker-pool';

export function selectPostsWithoutImages<PostLike extends { slug: string }>(
  posts: PostLike[],
  existingFiles: string[],
  ext: string,
): PostLike[] {
  const existingSet = new Set(existingFiles);
  return posts.filter((post) => !existingSet.has(`${post.slug}.${ext}`));
}

export class ScreenshotGenerator {
  private workerPool: WorkerPool | null = null;

  async generate(): Promise<void> {
    if (!cluster.isPrimary) {
      throw new Error('ScreenshotGenerator must run in primary process');
    }

    await mkdir(OGP_CONFIG.output.dir, { recursive: true });

    // runtime 用の Source（getPostsListJson）は使わず、search と同じく readJSON で読む。使うと dist の静的 import が build とそのテストに入る
    const allPosts = await readJSON<PostSummary[]>(path.join(BUILD_PATHS.dist, `${FILENAME_POSTS_LIST}.json`));

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

  private async filterNewPosts<PostLike extends { slug: string }>(posts: PostLike[]): Promise<PostLike[]> {
    const existingFiles = await readdir(OGP_CONFIG.output.dir).catch(() => [] as string[]);

    return selectPostsWithoutImages(posts, existingFiles, OGP_CONFIG.output.ext);
  }
}
