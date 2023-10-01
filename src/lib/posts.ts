import type {
  PageProps,
  PostListProps,
  PostPopularProps,
  PostProps,
  PostSimilarProps,
  TagSimilarProps,
  TagsListProps,
} from '@/types/source';
import pages from '~/dist/pages.json' assert { type: 'json' };
import posts from '~/dist/posts.json' assert { type: 'json' };
import postsList from '~/dist/posts-list.json' assert { type: 'json' };
import postsPopular from '~/dist/posts-popular.json' assert { type: 'json' };
import postsSimilarity from '~/dist/posts-similarity.json' assert { type: 'json' };
import tags from '~/dist/tags.json' assert { type: 'json' };
import tagsSimilarity from '~/dist/tags-similarity.json' assert { type: 'json' };
import tagsWithCount from '~/dist/tags-with-count.json' assert { type: 'json' };

export const getTagsJson = (): TagsListProps => {
  return tags;
};

export const getPostsJson = (): Map<PostProps['slug'], PostProps> => {
  return new Map(posts.map((post) => [post.slug, post]));
};

export const getPostsListJson = (): PostListProps[] => {
  return postsList;
};

export const getPagesJson = (): Map<PageProps['slug'], PageProps> => {
  return new Map(pages.map((page) => [page.slug, page]));
};

export const getTagsWithCount = () => {
  return tagsWithCount.tagsWithCount;
};

export const getSimilarTag = (): TagSimilarProps => {
  return tagsSimilarity;
};

export const getSimilarPost = (): PostSimilarProps => {
  return postsSimilarity;
};

export const getPostsPopular = (): PostPopularProps => {
  return postsPopular;
};
