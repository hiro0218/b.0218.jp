import type { getPostsListJson } from '@/lib/posts';
import type { PostListProps } from '@/types/source';

type ArchiveListProps = Record<number, PostListProps[]>;

const getYear = (date: PostListProps['date']) => Number(date.slice(0, 4));

export const divideByYearArchive = (posts: ReturnType<typeof getPostsListJson>): ArchiveListProps => {
  const result: ArchiveListProps = {};

  // slugでsortする
  const sortedPosts = Array.from(posts.values()).sort((a, b) => b.slug.localeCompare(a.slug));

  for (const post of sortedPosts) {
    const year = getYear(post.date);

    // 年ごとの配列が未定義であれば初期化する
    if (!result[year]) {
      result[year] = [];
    }

    result[year].push(post);
  }

  return result;
};
