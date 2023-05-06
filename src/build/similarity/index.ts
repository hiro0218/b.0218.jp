import { writeJSONSync } from 'fs-extra';

import { FILENAME_POSTS_SIMILARITY, FILENAME_TAG_SIMILARITY } from '@/constant';
import * as Log from '@/lib/Log';
import { getPostsListJson, getTagsJson } from '@/lib/posts';

import { getRelatedPosts } from './post';
import { getRelatedTags } from './tag';

const posts = getPostsListJson();
const tags = getTagsJson();

const PATH = {
  DIST: `${process.cwd()}/dist`,
} as const;

const relatedTags = getRelatedTags(posts, tags);

writeJSONSync(`${PATH.DIST}/${FILENAME_TAG_SIMILARITY}.json`, relatedTags);
Log.info(`Write dist/${FILENAME_TAG_SIMILARITY}.json`);

// 関連記事を計算する
const relatedPosts = getRelatedPosts(posts, posts, relatedTags);

writeJSONSync(`${PATH.DIST}/${FILENAME_POSTS_SIMILARITY}.json`, relatedPosts);
Log.info(`Write dist/${FILENAME_POSTS_SIMILARITY}.json`);
