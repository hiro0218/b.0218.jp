import { FILENAME_POSTS_SIMILARITY, FILENAME_TAG_SIMILARITY } from '@/constant';
import * as Log from '@/shared/Log';
import { readJSON, writeJSON } from '@/shared/fs';
import type { PostListProps, TagsListProps } from '@/types/source';

import { getRelatedPosts } from './post';
import { getRelatedTags } from './tag';

const PATH_DIST = `${process.cwd()}/dist`;

(async () => {
  const posts = await readJSON<PostListProps[]>(`${PATH_DIST}/posts-list.json`);
  const tags = await readJSON<TagsListProps>(`${PATH_DIST}/tags.json`);

  // 関連タグを計算する
  const relatedTags = getRelatedTags(posts, tags);

  await writeJSON(`${PATH_DIST}/${FILENAME_TAG_SIMILARITY}.json`, relatedTags);
  Log.info(`Write dist/${FILENAME_TAG_SIMILARITY}.json`);

  // 関連記事を計算する
  const relatedPosts = getRelatedPosts(posts, relatedTags);

  await writeJSON(`${PATH_DIST}/${FILENAME_POSTS_SIMILARITY}.json`, relatedPosts);
  Log.info(`Write dist/${FILENAME_POSTS_SIMILARITY}.json`);
})();
