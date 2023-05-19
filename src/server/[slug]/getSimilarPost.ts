import { getSimilarPost as getSimilarPosts } from '@/lib/posts';
import { PostProps, PostSimilarProps } from '@/types/source';

const getSimilarPostBySlug = (similarPosts: PostSimilarProps, key: string) => {
  const result = similarPosts.find((slug) => slug.hasOwnProperty(key));
  return result ? result[key] : null;
};

export const getSimilarPost = (posts: PostProps[], slug: string) => {
  const similarPosts = getSimilarPosts();
  const similarPostSlugs = getSimilarPostBySlug(similarPosts, slug);
  if (!similarPostSlugs) {
    return [];
  }
  const similarPost = Object.keys(similarPostSlugs)
    .map((slug) => {
      const post = posts.find((post) => post.slug === slug);
      if (!post) {
        return null;
      }
      const { title, date, updated, excerpt } = post;

      return {
        title,
        slug,
        date,
        updated,
        excerpt,
      };
    })
    .filter((post) => post !== null) as PostProps[];

  // 奇数の場合は偶数に寄せる
  if (similarPost.length % 2 !== 0) {
    similarPost.pop();
  }

  return similarPost;
};
