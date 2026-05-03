import { Stack } from '@/components/UI/Layout/Stack';
import { isSameDay } from '@/lib/utils/date';
import type { Post } from '@/types/source';
import { css } from '@/ui/styled';

type Props = Pick<Post, 'date' | 'updated'>;

/**
 * 記事の投稿日・更新日を表示する。更新がある場合は投稿日に取り消し線を付ける。
 * @summary 記事の投稿日・更新日表示
 */
export function PostDate({ date, updated }: Props) {
  const hasModified = !!updated && !isSameDay(new Date(date), new Date(updated));

  return (
    <Stack className={timeStyle} direction="horizontal" gap={1}>
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

const timeStyle = css`
  font-variant-numeric: tabular-nums;
  color: var(--colors-gray-700);
`;
