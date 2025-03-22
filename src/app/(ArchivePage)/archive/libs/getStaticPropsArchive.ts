import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import type { getPostsListJson } from '@/lib/posts';
import type { PostListProps } from '@/types/source';

export type ArchiveListProps = Record<string, PostListProps[]>;

const getYear = (date: PostListProps['date']) => Number(date.slice(0, 4));

export const divideByYearArchive = (posts: ReturnType<typeof getPostsListJson>): ArchiveListProps => {
  const result: ArchiveListProps = {};

  // slugでsortする
  const sortedPosts = posts.sort((a, b) => b.slug.localeCompare(a.slug));

  for (let i = 0; i < sortedPosts.length; i++) {
    const post = sortedPosts[i];
    const year = getYear(post.date);

    // 年ごとの配列が未定義であれば初期化する
    if (!result[year]) {
      result[year] = [];
    }

    result[year].push({
      ...post,
      ...getDateAndUpdatedToSimpleFormat(post.date),
    });
  }

  return result;
};
