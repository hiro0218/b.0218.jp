import type { Post, PostSummary } from '@/types/source';

export function toPostSummary(posts: Post[]): PostSummary[] {
  return posts.map((post) => {
    return {
      title: post.title,
      slug: post.slug,
      date: post.date,
      ...(post.updated && { updated: post.updated }),
      tags: post.tags,
    };
  });
}
