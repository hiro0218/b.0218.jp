import { Stack } from '@/components/UI/Layout';
import { isSameDay } from '@/lib/date';
import type { Post } from '@/types/source';
import { css } from '@/ui/styled';

type Props = Pick<Post, 'date' | 'updated'>;

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
