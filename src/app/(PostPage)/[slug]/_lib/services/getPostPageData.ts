import { cache } from 'react';
import { TAG_VIEW_LIMIT } from '@/constants';
import { getDateAndUpdatedToSimpleFormat } from '@/lib/post/date';
import { getPostsPopular, getSimilarPosts as getSimilarPostsIndex } from '@/lib/post/derived';
import { recentPosts } from '@/lib/post/list';
import { formatPostSummary } from '@/lib/post/summary';
import { getPostBySlug, getPostsListJson } from '@/lib/source/post';
import { getTagsJson, getTagsWithCount } from '@/lib/source/tag';
import { getSimilarTag } from '@/lib/tag/derived';
import type { ArticleSummary, PopularityDetail, Post } from '@/types/source';

const LIMIT_TAG_LIST = 10;
const RELATED_POSTS_LIMIT = 4;
const HTML_SUFFIX_PATTERN = /\.html$/;

type PostPageTag = {
  slug: string;
  count: number;
  isNavigable: boolean;
};

type PostPagePost = Omit<Post, 'date' | 'updated'> & {
  date: string;
  updated?: string;
  tagsWithCount: PostPageTag[];
  meta: {
    publishedTime: string;
    modifiedTime?: string;
  };
};

interface PostPageData {
  post: PostPagePost;
  similarPost: ArticleSummary[];
  similarTags: PostPageTag[];
  recentPosts: ArticleSummary[];
  sameTagPosts: ArticleSummary[];
  mostPopularTag?: { slug: string; count: number };
  popularity?: PopularityDetail;
}

const postsList = getPostsListJson();
const postsBySlug = new Map(postsList.map((post) => [post.slug, post]));
const tagsIndex = getTagsJson();
const tagsWithCount = getTagsWithCount();
const tagsWithCountBySlug = new Map(tagsWithCount.map((tag) => [tag.slug, tag]));
const similarPostsIndex = getSimilarPostsIndex();
const similarTagsIndex = getSimilarTag();
const popularityScores = getPostsPopular();

function normalizePostSlug(slug: string): string {
  return slug.replace(HTML_SUFFIX_PATTERN, '');
}

function createPostPageTag(tag: { slug: string; count: number }): PostPageTag {
  return {
    ...tag,
    isNavigable: tag.count >= TAG_VIEW_LIMIT,
  };
}

function getTagsWithCountFromPost(post: Post): PostPageTag[] {
  return post.tags
    .map((tag) => tagsWithCountBySlug.get(tag))
    .filter((tag) => tag !== undefined)
    .map(createPostPageTag);
}

function createPostPagePost(post: Post, postTags: PostPageTag[]): PostPagePost {
  return {
    ...post,
    ...getDateAndUpdatedToSimpleFormat(post.date, post.updated),
    tagsWithCount: postTags,
    meta: {
      publishedTime: post.date,
      ...(post.updated && { modifiedTime: post.updated }),
    },
  };
}

function getSimilarPostSummaries(slug: string): ArticleSummary[] {
  const similarPostSlugs = similarPostsIndex[slug];

  if (!similarPostSlugs) {
    return [];
  }

  const posts: ArticleSummary[] = [];

  for (const postSlug of Object.keys(similarPostSlugs)) {
    const post = postsBySlug.get(postSlug);
    if (post) {
      posts.push(formatPostSummary(post));
    }
  }

  return posts;
}

function getPostSummariesByTag(tagSlug: string, excludeSlug: string, limit: number): ArticleSummary[] {
  const postSlugs = tagsIndex[tagSlug] ?? [];
  const posts: ArticleSummary[] = [];

  for (const postSlug of postSlugs) {
    if (postSlug === excludeSlug) {
      continue;
    }

    const post = postsBySlug.get(postSlug);
    if (post) {
      posts.push(formatPostSummary(post));
    }

    if (posts.length >= limit) {
      break;
    }
  }

  return posts;
}

function getRelatedPosts(slug: string, tag: string | undefined): ArticleSummary[] {
  const similarPosts = getSimilarPostSummaries(slug);

  if (similarPosts.length > 0 || !tag) {
    return similarPosts;
  }

  return getPostSummariesByTag(tag, slug, RELATED_POSTS_LIMIT);
}

function getSimilarTags(tag: string | undefined): PostPageTag[] {
  if (!tag) {
    return [];
  }

  const similarTags = similarTagsIndex[tag];
  if (!similarTags) {
    return [];
  }

  const validTags: PostPageTag[] = [];

  for (const slug of Object.keys(similarTags)) {
    const count = tagsIndex[slug]?.length ?? 0;

    if (count >= TAG_VIEW_LIMIT) {
      validTags.push({ slug, count, isNavigable: true });
    }
  }

  return validTags.toSorted((a, b) => b.count - a.count).slice(0, LIMIT_TAG_LIST);
}

function getMostPopularTag(tags: PostPageTag[]): PostPageTag | undefined {
  if (tags.length === 0) {
    return undefined;
  }

  return tags.reduce((max, tag) => (tag.count > max.count ? tag : max));
}

function getSameTagPosts(
  tags: PostPageTag[],
  currentSlug: string,
): Pick<PostPageData, 'mostPopularTag' | 'sameTagPosts'> {
  const mostPopularTag = getMostPopularTag(tags);

  if (!mostPopularTag) {
    return { sameTagPosts: [] };
  }

  const sameTagPosts = getPostSummariesByTag(mostPopularTag.slug, currentSlug, RELATED_POSTS_LIMIT);

  if (sameTagPosts.length === 0) {
    return { sameTagPosts: [] };
  }

  return { mostPopularTag, sameTagPosts };
}

export const getPostPageData = cache((slug: string): PostPageData | null => {
  const normalizedSlug = normalizePostSlug(slug);
  const post = getPostBySlug(normalizedSlug);

  if (post === null) {
    return null;
  }

  const postTags = getTagsWithCountFromPost(post);
  const formattedPost = createPostPagePost(post, postTags);
  const tag = post.tags?.[0];
  const similarTags = tag ? getSimilarTags(tag) : [];
  const similarPost = getRelatedPosts(normalizedSlug, tag);
  const popularity = popularityScores[normalizedSlug];
  const { mostPopularTag, sameTagPosts } = getSameTagPosts(postTags, normalizedSlug);

  return {
    post: formattedPost,
    similarPost,
    similarTags,
    recentPosts,
    sameTagPosts,
    mostPopularTag,
    popularity,
  } satisfies PostPageData;
});
