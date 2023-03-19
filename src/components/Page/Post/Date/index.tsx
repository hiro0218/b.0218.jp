import { convertDateToSimpleFormat, isSameDay } from '@/lib/date';
import { Post } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = Pick<Post, 'date' | 'updated'>;

const PostDate = ({ date, updated }: Props) => {
  const hasModified = updated && !isSameDay(new Date(date), new Date(updated));

  return (
    <PostDateRoot>
      <PostDateItem existModified={hasModified}>
        <time dateTime={date} itemProp="datePublished" title={'投稿日時: ' + date}>
          {convertDateToSimpleFormat(new Date(date))}
        </time>
      </PostDateItem>
      {!!updated && (
        <PostDateItem>
          <time dateTime={updated} itemProp="dateModified" title={'更新日時: ' + updated}>
            {convertDateToSimpleFormat(new Date(updated))}
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
  opacity: 0.8;
`;

const PostDateItem = styled.div<{ existModified?: boolean }>`
  display: flex;
  align-items: center;

  ${({ existModified }) => {
    return existModified && existModifiedStyle;
  }}
`;
