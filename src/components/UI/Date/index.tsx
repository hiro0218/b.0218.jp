import { Stack } from '@/components/UI/Layout';
import { convertDateToSimpleFormat, isSameDay } from '@/lib/date';
import type { PostProps } from '@/types/source';

type Props = Pick<PostProps, 'date' | 'updated'>;

function PostDate({ date, updated }: Props) {
  const dateTime = new Date(date);
  const updatedTime = new Date(updated);
  const hasModified = !!updated && !isSameDay(dateTime, updatedTime);

  return (
    <Stack direction="horizontal" space="1">
      <time
        dateTime={date}
        style={{
          ...(hasModified && { textDecoration: 'line-through' }),
        }}
        title={`投稿日時: ${date}`}
      >
        {convertDateToSimpleFormat(dateTime)}
      </time>
      {!!hasModified && (
        <time dateTime={updated} title={`更新日時: ${updated}`}>
          {convertDateToSimpleFormat(updatedTime)}
        </time>
      )}
    </Stack>
  );
}

export default PostDate;
