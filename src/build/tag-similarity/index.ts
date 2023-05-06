import { writeJSONSync } from 'fs-extra';

import { FILENAME_POSTS_SIMILARITY, FILENAME_TAG_SIMILARITY } from '@/constant';
import * as Log from '@/lib/Log';
import { getPostsListJson, getTagsJson } from '@/lib/posts';

type PostProps = UnpackedArray<ReturnType<typeof getPostsListJson>>;
type TagSimilarity = {
  [key: string]: {
    [key: string]: number;
  };
};

const posts = getPostsListJson();
const tags = getTagsJson();

const PATH = {
  DIST: `${process.cwd()}/dist`,
} as const;

// 共起頻度行列
const coOccurrenceMatrix = {};

for (let i = 0; i < posts.length; i++) {
  const tags = posts[i].tags;
  for (let j = 0; j < tags.length; j++) {
    const tag = tags[j];
    if (!coOccurrenceMatrix[tag]) {
      coOccurrenceMatrix[tag] = {};
    }
    for (let k = 0; k < tags.length; k++) {
      const otherTag = tags[k];
      if (j !== k) {
        if (!coOccurrenceMatrix[tag][otherTag]) {
          coOccurrenceMatrix[tag][otherTag] = 1;
        } else {
          coOccurrenceMatrix[tag][otherTag]++;
        }
      }
    }
  }
}

// タグ関連性を計算する
const tagRelations: TagSimilarity = {};
const tagsKeys = Object.keys(tags);

for (let i = 0, tagKeysLen = tagsKeys.length; i < tagKeysLen; i++) {
  const tag = tagsKeys[i];
  const tagArticles = tags[tag];
  const tagArticleCount = tagArticles.length;
  const coOccurrenceTags = coOccurrenceMatrix[tag];
  const coOccurrenceTagKeys = Object.keys(coOccurrenceTags);

  for (let j = 0, coOccurrenceKeysLen = coOccurrenceTagKeys.length; j < coOccurrenceKeysLen; j++) {
    const otherTag = coOccurrenceTagKeys[j];
    const otherTagArticles = tags[otherTag];
    if (!otherTagArticles) {
      continue;
    }
    const otherTagArticleCount = otherTagArticles.length;
    const count = coOccurrenceTags[otherTag];
    const relation = count / Math.sqrt(tagArticleCount * otherTagArticleCount);
    if (!tagRelations[tag]) {
      tagRelations[tag] = {};
    }
    tagRelations[tag][otherTag] = relation;
  }
}

// 数値の高い順に並び替え、数値を切り上げ
const sortedTags = {};
const tagRelationsKeys = Object.keys(tagRelations);

for (let i = 0, tagRelationsKeysLen = tagRelationsKeys.length; i < tagRelationsKeysLen; i++) {
  const tag = tagRelationsKeys[i];
  const sortedRelatedTags = {};
  const relatedTagEntries = Object.entries(tagRelations[tag]);
  relatedTagEntries.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);

  for (let j = 0, relatedTagEntriesLen = relatedTagEntries.length; j < relatedTagEntriesLen; j++) {
    const [key, value] = relatedTagEntries[j] as [string, number];
    sortedRelatedTags[key] = Number(value.toFixed(4));
  }

  sortedTags[tag] = sortedRelatedTags;
}

writeJSONSync(`${PATH.DIST}/${FILENAME_TAG_SIMILARITY}.json`, sortedTags);
Log.info(`Write dist/${FILENAME_TAG_SIMILARITY}.json`);

// 関連記事を計算する
function calculatePostSimilarity(post: PostProps, targetPostTags: PostProps['tags'], sortedTags: TagSimilarity) {
  let similarityScore = 0;

  targetPostTags.forEach((tag) => {
    if (sortedTags[tag]) {
      post.tags.forEach((relatedTag) => {
        if (sortedTags[tag][relatedTag]) {
          similarityScore += sortedTags[tag][relatedTag];
        }
      });
    }
  });

  return Number(similarityScore.toFixed(4));
}

function getRelatedPosts(targetPosts: PostProps[], posts: PostProps[], sortedTags: TagSimilarity) {
  const LIMIT = 6;
  return targetPosts.map((targetPost) => {
    const targetPostTags = targetPost.tags;
    const scoredArticles = [];

    posts.forEach((post) => {
      if (post.slug !== targetPost.slug) {
        const similarityScore = calculatePostSimilarity(post, targetPostTags, sortedTags);
        if (similarityScore > 0) {
          scoredArticles.push({ ...post, similarityScore });
        }
      }
    });

    scoredArticles.sort((a, b) => b.similarityScore - a.similarityScore);

    const relatedArticles = scoredArticles.slice(0, LIMIT).reduce((acc, post) => {
      acc[post.slug] = post.similarityScore;
      return acc;
    }, {});

    return {
      [targetPost.slug]: relatedArticles,
    };
  });
}

const relatedPosts = getRelatedPosts(posts, posts, sortedTags);

writeJSONSync(`${PATH.DIST}/${FILENAME_POSTS_SIMILARITY}.json`, relatedPosts);
Log.info(`Write dist/${FILENAME_POSTS_SIMILARITY}.json`);
