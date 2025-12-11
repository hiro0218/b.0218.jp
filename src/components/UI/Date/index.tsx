import { Stack } from '@/components/UI/Layout';
import { isSameDay } from '@/lib/utils/date';
import type { Post } from '@/types/source';
import { css } from '@/ui/styled';

type Props = Pick<Post, 'date' | 'updated'>;

function PostDate({ date, updated }: Props) {
  const hasModified = !!updated && !isSameDay(new Date(date), new Date(updated));

  return (
    <Stack className={timeStyle} direction="horizontal" space={1}>
      <time
        className={
          hasModified
            ? css`
                color: var(--colors-gray-600);
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

const timeStyle = css`
  font-variant-numeric: tabular-nums;
  color: var(--colors-gray-700);
`;
