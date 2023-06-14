import { convertDateToSimpleFormat, isSameDay } from '@/lib/date';
import type { PostProps } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = Pick<PostProps, 'date' | 'updated'>;

function PostDate({ date, updated }: Props) {
  const dateTime = new Date(date);
  const updatedTime = new Date(updated);
  const hasModified = !!updated && !isSameDay(dateTime, updatedTime);

  return (
    <Container>
      <time
        dateTime={date}
        style={{
          ...(hasModified && { textDecoration: 'line-through' }),
        }}
        title={`投稿日時: ${date}`}
      >
        {convertDateToSimpleFormat(date)}
      </time>
      {!!hasModified && (
        <time dateTime={updated} title={`更新日時: ${updated}`}>
          {convertDateToSimpleFormat(updated)}
        </time>
      )}
    </Container>
  );
}

export default PostDate;

const Container = styled.div`
  display: flex;
  gap: var(--space-1);
  color: var(--text-11);
`;
