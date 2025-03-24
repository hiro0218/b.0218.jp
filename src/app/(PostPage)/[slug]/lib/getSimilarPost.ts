import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import { getSimilarPosts } from '@/lib/posts';
import type { PostProps } from '@/types/source';

const similarPosts = getSimilarPosts();

const getSimilarPostBySlug = (key: string) => {
  const result = similarPosts.find((slug) => slug.hasOwnProperty(key));
  return result ? result[key] : null;
};

export const getSimilarPost = (posts: PostProps[], slug: string) => {
  const similarPostSlugs = getSimilarPostBySlug(slug);

  if (!similarPostSlugs) {
    return [];
  }

  const slugs = Object.keys(similarPostSlugs);

  const existingSlugs = slugs.filter((slug) => posts.some((post) => post.slug === slug));

  const similarPost = existingSlugs.map((slug) => {
    const { title, date, updated } = posts.find((post) => post.slug === slug);
    return {
      title,
      slug,
      ...getDateAndUpdatedToSimpleFormat(date, updated),
    };
  });

  return similarPost;
};
