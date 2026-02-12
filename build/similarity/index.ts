import { FILENAME_POSTS_SIMILARITY, FILENAME_TAG_SIMILARITY } from '@/constants';
import type { TagIndex } from '@/types/source';
import { BUILD_PATHS } from '~/build/shared/paths';
import { readAllPosts } from '~/build/shared/readAllPosts';
import { readJSON, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';

import { getRelatedPosts } from './post';
import { getRelatedTags } from './tag';

(async () => {
  const startTime = Date.now();
  let exitCode = 0;

  try {
    Log.info('類似度計算を開始...');

    // データ読み込み
    const posts = readAllPosts();
    const tags = await readJSON<TagIndex>(`${BUILD_PATHS.dist}/tags.json`);
    Log.info(`記事: ${posts.length}件, タグ: ${Object.keys(tags).length}件`);

    // 関連タグを計算する
    const relatedTags = getRelatedTags(posts, tags);
    await writeJSON(`${BUILD_PATHS.dist}/${FILENAME_TAG_SIMILARITY}.json`, relatedTags);

    // 関連記事を計算する
    const relatedPosts = await getRelatedPosts(posts, relatedTags);
    await writeJSON(`${BUILD_PATHS.dist}/${FILENAME_POSTS_SIMILARITY}.json`, relatedPosts);

    const totalElapsedTime = Math.round((Date.now() - startTime) / 1000);
    Log.info(`類似度計算完了 (${totalElapsedTime}秒)`);
  } catch (error) {
    exitCode = 1;
    Log.error('類似度計算処理に失敗しました');

    if (error instanceof Error) {
      Log.error(`エラー: ${error.message}`);
      if (error.stack) {
        Log.error(error.stack);
      }
    } else {
      Log.error('不明なエラー:', error);
    }
  } finally {
    if (exitCode !== 0) {
      process.exit(exitCode);
    }
  }
})();
