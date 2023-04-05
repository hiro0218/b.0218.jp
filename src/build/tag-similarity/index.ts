import { writeJSONSync } from 'fs-extra';

import { FILENAME_TAG_SIMILARITY } from '@/constant';
import * as Log from '@/lib/Log';
import { getPostsListJson, getTagsJson } from '@/lib/posts';

const posts = getPostsListJson();
const tags = getTagsJson();

const PATH = {
  DIST: `${process.cwd()}/dist`,
} as const;

// 共起頻度行列
const coOccurrenceMatrix = {};

posts.forEach((article) => {
  const tags = article.tags;
  tags.forEach((tag) => {
    if (!coOccurrenceMatrix[tag]) {
      coOccurrenceMatrix[tag] = {};
    }
    tags.forEach((otherTag) => {
      if (tag !== otherTag) {
        if (!coOccurrenceMatrix[tag][otherTag]) {
          coOccurrenceMatrix[tag][otherTag] = 1;
        } else {
          coOccurrenceMatrix[tag][otherTag]++;
        }
      }
    });
  });
});

// タグ関連性を計算する
const tagRelations = {};

for (const tag in coOccurrenceMatrix) {
  for (const otherTag in coOccurrenceMatrix[tag]) {
    const count = coOccurrenceMatrix[tag][otherTag];
    if (!tags[tag]) {
      continue;
    }
    const tagArticleCount = tags[tag].length;
    if (!tags[otherTag]) {
      continue;
    }
    const otherTagArticleCount = tags[otherTag].length;
    const relation = count / Math.sqrt(tagArticleCount * otherTagArticleCount);
    if (!tagRelations[tag]) {
      tagRelations[tag] = {};
    }
    tagRelations[tag][otherTag] = relation;
  }
}

// 数値の高い順に並び替え、数値を切り上げ
const sortedTags = {};

for (const tag in tagRelations) {
  const sortedRelatedTags = {};
  const relatedTagEntries = Object.entries(tagRelations[tag]);
  relatedTagEntries.sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
  relatedTagEntries.forEach(([key, value]: [string, number]) => {
    sortedRelatedTags[key] = Number(value.toFixed(4));
  });
  sortedTags[tag] = sortedRelatedTags;
}

writeJSONSync(`${PATH.DIST}/${FILENAME_TAG_SIMILARITY}.json`, sortedTags);
Log.info(`Write dist/${FILENAME_TAG_SIMILARITY}.json`);
