import type { PostListProps, TagSimilarProps, TagsListProps } from '@/types/source';

type OccurrenceMatrixProps = {
  [tag: string]: {
    [relatedTag: string]: number;
  };
};

function createCoOccurrenceMatrix(posts: PostListProps[]) {
  const coOccurrenceMatrix: OccurrenceMatrixProps = {};

  for (let i = 0; i < posts.length; i++) {
    const tags = posts[i].tags;
    if (!tags) {
      continue;
    }

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

  return coOccurrenceMatrix;
}

function calculateTagRelations(tags: TagsListProps, coOccurrenceMatrix: OccurrenceMatrixProps) {
  const tagRelations: TagSimilarProps = {};
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

  return tagRelations;
}

function sortTagRelations(tagRelations: TagSimilarProps) {
  const sortedTags: TagSimilarProps = {};
  const tagRelationsKeys = Object.keys(tagRelations);

  for (let i = 0, tagRelationsKeysLen = tagRelationsKeys.length; i < tagRelationsKeysLen; i++) {
    const tag = tagRelationsKeys[i];
    const sortedRelatedTags = {};
    const relatedTagEntries = Object.entries(tagRelations[tag]);
    relatedTagEntries.sort((a, b) => b[1] - a[1]);

    for (let j = 0, relatedTagEntriesLen = relatedTagEntries.length; j < relatedTagEntriesLen; j++) {
      const [key, value] = relatedTagEntries[j];
      sortedRelatedTags[key] = Number(value.toFixed(4));
    }

    sortedTags[tag] = sortedRelatedTags;
  }

  return sortedTags;
}

export function getRelatedTags(posts: PostListProps[], tags: TagsListProps) {
  const coOccurrenceMatrix = createCoOccurrenceMatrix(posts);
  const tagRelations = calculateTagRelations(tags, coOccurrenceMatrix);
  const sortedTags = sortTagRelations(tagRelations);

  return sortedTags;
}
