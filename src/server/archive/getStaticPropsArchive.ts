import type { getPostsListJson } from '@/lib/posts';
type PostsProps = ReturnType<typeof getPostsListJson>;
type PostProps = UnpackedArray<PostsProps>;
type ArchiveListProps = Record<number, PostsProps>;

const getYear = (date: PostProps['date']) => Number(date.slice(0, 4));

export const divideByYearArchive = (posts: PostsProps): ArchiveListProps => {
  const result: ArchiveListProps = {};

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const year = getYear(post.date);

    if (!result[year]) {
      result[year] = [];
    }

    result[year].push(post);
  }

  return result;
};
