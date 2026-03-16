import { getDateAndUpdatedToSimpleFormat } from '@/app/_lib/getDateAndUpdatedToSimpleFormat';
import type { getPostsListJson } from '@/lib/data/posts';
import type { ArchivesByYear, PostSummary } from '@/types/source';

const getYear = (date: PostSummary['date']) => Number(date.slice(0, 4));

const sortPostsBySlug = (posts: ReturnType<typeof getPostsListJson>) =>
  posts.toSorted((a, b) => b.slug.localeCompare(a.slug));

const groupPostsByYear = (posts: PostSummary[]): ArchivesByYear => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    ...getDateAndUpdatedToSimpleFormat(post.date),
  }));

  return Object.groupBy(transformedPosts, (post) => String(getYear(post.date))) as ArchivesByYear;
};

export const getData = (posts: ReturnType<typeof getPostsListJson>): ArchivesByYear => {
  const sortedPosts = sortPostsBySlug(posts);
  return groupPostsByYear(sortedPosts);
};
