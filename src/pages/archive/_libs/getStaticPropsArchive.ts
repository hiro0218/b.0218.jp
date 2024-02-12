import type { getPostsListJson } from '@/lib/posts';

type PostsProps = ReturnType<typeof getPostsListJson>;
type PostProps = UnpackedArray<PostsProps>;
type ArchiveListProps = Record<number, PostsProps>;

const getYear = (date: PostProps['date']) => Number(date.slice(0, 4));

export const divideByYearArchive = (posts: PostsProps): ArchiveListProps => {
  const result: ArchiveListProps = {};

  // slugでsortする
  const sortedPosts = [...posts].sort((a, b) => b.slug.localeCompare(a.slug));

  for (const post of sortedPosts) {
    const year = getYear(post.date);

    if (!result[year]) {
      result[year] = [];
    }

    result[year].push(post);
  }

  return result;
};
