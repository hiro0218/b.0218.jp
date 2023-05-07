import { getSimilarPost as getSimilarPosts } from '@/lib/posts';
import { Post as PostType, PostSimilar as PostSimilarProps } from '@/types/source';

const getSimilarPostBySlug = (similarPosts: PostSimilarProps, key: string) => {
  const result = similarPosts.find((slug) => slug.hasOwnProperty(key));
  return result ? result[key] : null;
};

export const getSimilarPost = (posts: PostType[], slug: string) => {
  const similarPosts = getSimilarPosts();
  const similarPostSlugs = getSimilarPostBySlug(similarPosts, slug);
  const similarPost = Object.keys(similarPostSlugs).map((slug) => {
    const { title, date, updated, excerpt } = posts.find((post) => post.slug === slug);

    return {
      title,
      slug,
      date,
      updated,
      excerpt,
    };
  });

  // 奇数の場合は偶数に寄せる
  if (similarPost.length % 2 !== 0) {
    similarPost.pop();
  }

  return similarPost;
};
