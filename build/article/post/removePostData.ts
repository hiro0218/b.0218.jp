import type { Post } from '@/types/source';

export function removePostsData(posts: Partial<Post>[]) {
  const length = posts.length;

  for (let i = 0; i < length; i++) {
    const post = posts[i];
    post.note = undefined;
    post.content = undefined;
  }

  return posts;
}
