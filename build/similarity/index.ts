import { FILENAME_POSTS_SIMILARITY, FILENAME_TAG_SIMILARITY } from '@/constants';
import type { Post, TagIndex } from '@/types/source';
import { BUILD_PATHS } from '~/build/shared/paths';
import { readJSON, writeJSON } from '~/tools/fs';
import * as Log from '~/tools/logger';

import { getRelatedPosts } from './post';
import { getRelatedTags } from './tag';

(async () => {
  try {
    const posts = await readJSON<Post[]>(`${BUILD_PATHS.dist}/posts.json`);
    const tags = await readJSON<TagIndex>(`${BUILD_PATHS.dist}/tags.json`);

    // 関連タグを計算する
    const relatedTags = getRelatedTags(posts, tags);

    await writeJSON(`${BUILD_PATHS.dist}/${FILENAME_TAG_SIMILARITY}.json`, relatedTags);
    Log.info(`Write dist/${FILENAME_TAG_SIMILARITY}.json`);

    // 関連記事を計算する
    const relatedPosts = await getRelatedPosts(posts, relatedTags);

    await writeJSON(`${BUILD_PATHS.dist}/${FILENAME_POSTS_SIMILARITY}.json`, relatedPosts);
    Log.info(`Write dist/${FILENAME_POSTS_SIMILARITY}.json`);
  } catch (error) {
    Log.error('類似度計算処理に失敗しました:', error);
  }
})();
