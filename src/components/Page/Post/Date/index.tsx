import { convertDateToSimpleFormat, isSameDate } from '@/lib/date';
import { Post } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = Pick<Post, 'date' | 'updated'>;

const PostDate = ({ date, updated }: Props) => {
  const existsModified = !isSameDate(date, updated);

  return (
    <PostDateRoot>
      <PostDateItem existModified={existsModified}>
        <time dateTime={date} itemProp="datePublished" title={'投稿日時: ' + date}>
          {convertDateToSimpleFormat(date)}
        </time>
      </PostDateItem>
      {existsModified && (
        <PostDateItem>
          <time dateTime={updated} itemProp="dateModified" title={'更新日時: ' + updated}>
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
  align-items: center;
  gap: var(--space-half);
`;

const PostDateItem = styled.div<{ existModified?: boolean }>`
  display: flex;
  align-items: center;

  ${({ existModified }) => {
    return (
      existModified &&
      css`
        opacity: 0.8
        text-decoration: line-through
      `
    );
  }}
`;
