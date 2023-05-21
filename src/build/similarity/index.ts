import { readJSONSync, writeJSONSync } from 'fs-extra';

import { FILENAME_POSTS_SIMILARITY, FILENAME_TAG_SIMILARITY } from '@/constant';
import * as Log from '@/lib/Log';

import { getRelatedPosts } from './post';
import { getRelatedTags } from './tag';

const PATH_DIST = `${process.cwd()}/dist`;

const posts = readJSONSync(`${PATH_DIST}/posts.json`);
const tags = readJSONSync(`${PATH_DIST}/tags.json`);

// 関連タグを計算する
const relatedTags = getRelatedTags(posts, tags);

writeJSONSync(`${PATH_DIST}/${FILENAME_TAG_SIMILARITY}.json`, relatedTags);
Log.info(`Write dist/${FILENAME_TAG_SIMILARITY}.json`);

// 関連記事を計算する
const relatedPosts = getRelatedPosts(posts, posts, relatedTags);

writeJSONSync(`${PATH_DIST}/${FILENAME_POSTS_SIMILARITY}.json`, relatedPosts);
Log.info(`Write dist/${FILENAME_POSTS_SIMILARITY}.json`);
