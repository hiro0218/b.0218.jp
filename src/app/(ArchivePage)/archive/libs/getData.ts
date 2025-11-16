import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import type { getPostsListJson } from '@/lib/data/posts';
import type { PostSummary } from '@/types/source';

export type ArchiveListProps = Record<string, PostSummary[]>;

const getYear = (date: PostSummary['date']) => Number(date.slice(0, 4));

const sortPostsBySlug = (posts: ReturnType<typeof getPostsListJson>) =>
  posts.toSorted((a, b) => b.slug.localeCompare(a.slug));

const groupPostsByYear = (posts: PostSummary[]): ArchiveListProps => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    ...getDateAndUpdatedToSimpleFormat(post.date),
  }));

  return Object.groupBy(transformedPosts, (post) => String(getYear(post.date))) as ArchiveListProps;
};

export const getData = (posts: ReturnType<typeof getPostsListJson>): ArchiveListProps => {
  const sortedPosts = sortPostsBySlug(posts);
  return groupPostsByYear(sortedPosts);
};
