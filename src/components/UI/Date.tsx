import { Stack } from '@/components/UI/Layout/Stack';
import { isSameDay } from '@/lib/utils/date';
import type { Post } from '@/types/source';
import { css, cx } from '@/ui/styled';

type Props = Pick<Post, 'date' | 'updated'> & {
  /** 投稿日 time 要素へ追加する className（呼び出し元固有の用途向け。例: microformats2 の dt-published） */
  publishedClassName?: string;
  /** 更新日 time 要素へ追加する className（例: microformats2 の dt-updated） */
  updatedClassName?: string;
};

/**
 * 記事の投稿日・更新日を表示する。更新がある場合は投稿日に取り消し線を付ける。
 * @summary 記事の投稿日・更新日表示
 */
export function PostDate({ date, publishedClassName, updated, updatedClassName }: Props) {
  const hasModified = !!updated && !isSameDay(new Date(date), new Date(updated));

  return (
    <Stack className={timeStyle} direction="horizontal" gap={100}>
      <time className={cx(publishedClassName, hasModified && modifiedStyle)} dateTime={date}>
        {date}
      </time>
      {!!hasModified && (
        <Stack direction="horizontal" gap={75}>
          <span aria-hidden="true" className="sr-only">
            更新:
          </span>
          <time className={updatedClassName} dateTime={updated}>
            {updated}
          </time>
        </Stack>
      )}
    </Stack>
  );
}

const timeStyle = css`
  font-variant-numeric: tabular-nums;
  color: var(--colors-gray-700);
`;

const modifiedStyle = css`
  color: var(--colors-gray-600);
  text-decoration: line-through;
`;
