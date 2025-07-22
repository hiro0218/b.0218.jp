import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import type { PostProps } from '@/types/source';

type FormattedPostData = PostProps & {
  tagsWithCount: PostTagProps[];
  meta: {
    publishedTime: string;
    modifiedTime?: string;
  };
};

export function formatPostData(post: PostProps, tagsWithCount: PostTagProps[]): FormattedPostData | null {
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
