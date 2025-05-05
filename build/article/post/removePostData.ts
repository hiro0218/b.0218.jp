import type { PostProps } from '@/types/source';

export function removePostsData(posts: Partial<PostProps>[]) {
  const length = posts.length;

  for (let i = 0; i < length; i++) {
    const post = posts[i];
    delete post.note;
    delete post.content;
  }

  return posts;
}
