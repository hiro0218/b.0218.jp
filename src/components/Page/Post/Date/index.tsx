import { convertDateToSimpleFormat, isSameDay } from '@/lib/date';
import { PostProps } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = Pick<PostProps, 'date' | 'updated'>;

const PostDate = ({ date, updated }: Props) => {
  const dateTime = new Date(date);
  const updatedTime = new Date(updated);
  const hasModified = !!updated && !isSameDay(dateTime, updatedTime);

  return (
    <PostDateRoot>
      <PostDateItem existModified={hasModified}>
        <time dateTime={date} title={`投稿日時: ${date}`}>
          {convertDateToSimpleFormat(date)}
        </time>
      </PostDateItem>
      {hasModified && (
        <PostDateItem>
          <time dateTime={updated} title={`更新日時: ${updated}`}>
            {convertDateToSimpleFormat(updated)}
          </time>
        </PostDateItem>
      )}
    </PostDateRoot>
  );
};

export default PostDate;

const PostDateRoot = styled.div`
  display: flex;
  gap: var(--space-1);
  align-items: center;
  color: var(--text-11);
`;

const existModifiedStyle = css`
  text-decoration: line-through;
`;

const PostDateItem = styled.div<{ existModified?: boolean }>`
  display: flex;
  align-items: center;

  ${({ existModified }) => {
    return existModified && existModifiedStyle;
  }}
`;
