import { getSimilarPosts } from '@/lib/posts';
import type { PostProps } from '@/types/source';

const similarPosts = getSimilarPosts();

const getSimilarPostBySlug = (key: string) => {
  const result = similarPosts.find((slug) => slug.hasOwnProperty(key));
  return result ? result[key] : null;
};

export const getSimilarPost = (posts: Map<PostProps['slug'], PostProps>, slug: string) => {
  const similarPostSlugs = getSimilarPostBySlug(slug);
  if (!similarPostSlugs) {
    return [];
  }
  const similarPost = Object.keys(similarPostSlugs)
    .map((slug) => {
      const post = posts.get(slug);
      if (!post) {
        return null;
      }
      const { title, date, updated } = post;

      return {
        title,
        slug,
        date,
        updated,
      };
    })
    .filter((post) => post !== null) as PostProps[];

  // 奇数の場合は偶数に寄せる
  if (similarPost.length % 2 !== 0) {
    similarPost.pop();
  }

  return similarPost;
};
