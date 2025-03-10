import { Stack } from '@/components/UI/Layout';
import { isSameDay } from '@/lib/date';
import type { PostProps } from '@/types/source';
import { css } from '@/ui/styled/static';

type Props = Pick<PostProps, 'date' | 'updated'>;

function PostDate({ date, updated }: Props) {
  const hasModified = !!updated && !isSameDay(new Date(date), new Date(updated));

  return (
    <Stack direction="horizontal" space={1}>
      <time
        className={
          hasModified
            ? css`
                text-decoration: line-through;
              `
            : undefined
        }
        dateTime={date}
      >
        {date}
      </time>
      {!!hasModified && <time dateTime={updated}>{updated}</time>}
    </Stack>
  );
}

export default PostDate;
