import { getSimilarPosts } from '@/lib/posts';
import { getDateAndUpdatedToSimpleFormat } from '@/pages/_libs/getDateAndUpdatedToSimpleFormat';
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

  const slugs = Object.keys(similarPostSlugs);

  const existingSlugs = slugs.filter((slug) => posts.has(slug));

  const similarPost = existingSlugs.map((slug) => {
    const { title, date, updated } = posts.get(slug);
    return {
      title,
      slug,
      ...getDateAndUpdatedToSimpleFormat(date, updated),
    };
  });

  return similarPost;
};
