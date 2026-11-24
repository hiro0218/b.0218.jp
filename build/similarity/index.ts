import { readDist, readDistPosts, writeDist } from '~/build/shared/dist';
import * as Log from '~/build/shared/logger';

import { getRelatedPosts } from './post';
import { getRelatedTags } from './tag';

(async () => {
  const startTime = Date.now();
  let exitCode = 0;

  try {
    Log.info('類似度計算を開始...');

    // データ読み込み
    const posts = readDistPosts();
    const tags = await readDist('tags');
    Log.info(`記事: ${posts.length}件, タグ: ${Object.keys(tags).length}件`);

    // 関連タグを計算する
    const relatedTags = getRelatedTags(posts, tags);
    await writeDist('tags-similarity', relatedTags);

    // 関連記事を計算する
    const relatedPosts = await getRelatedPosts(posts, relatedTags);
    await writeDist('posts-similarity', relatedPosts);

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
