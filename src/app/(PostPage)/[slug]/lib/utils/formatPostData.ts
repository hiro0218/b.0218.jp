import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import type { Post } from '@/types/source';

interface FormattedPostData extends Post {
  tagsWithCount: PostTagProps[];
  meta: {
    publishedTime: string;
    modifiedTime?: string;
  };
}

export function formatPostData(post: Post, tagsWithCount: PostTagProps[]): FormattedPostData | null {
  if (!post) return null;

  const { date, updated } = post;
  const formattedDates = getDateAndUpdatedToSimpleFormat(date, updated);

  const result = {
    ...post,
    ...formattedDates,
    tagsWithCount,
    meta: {
      publishedTime: post.date,
      ...(post.updated && { modifiedTime: post.updated }),
    },
  };

  return result;
}
