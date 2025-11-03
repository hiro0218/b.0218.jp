import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import type { getPostsListJson } from '@/lib/data/posts';
import type { PostSummary } from '@/types/source';

export type ArchiveListProps = Record<string, PostSummary[]>;

const getYear = (date: PostSummary['date']) => Number(date.slice(0, 4));

const sortPostsBySlug = (posts: ReturnType<typeof getPostsListJson>) => {
  // ソート処理を最適化
  return posts.slice().sort((a, b) => b.slug.localeCompare(a.slug));
};

const groupPostsByYear = (posts: PostSummary[]): ArchiveListProps => {
  const result = new Map<number, PostSummary[]>();

  for (const post of posts) {
    const year = getYear(post.date);

    if (!result.has(year)) {
      result.set(year, []);
    }

    result.get(year)!.push({
      ...post,
      ...getDateAndUpdatedToSimpleFormat(post.date),
    });
  }

  // Mapをオブジェクトに変換
  return Object.fromEntries(result);
};

export const getData = (posts: ReturnType<typeof getPostsListJson>): ArchiveListProps => {
  const sortedPosts = sortPostsBySlug(posts);
  return groupPostsByYear(sortedPosts);
};
