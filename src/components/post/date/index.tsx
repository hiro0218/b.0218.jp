import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC } from 'react';

import { convertDateToSimpleFormat, isSameDate } from '@/lib/date';
import { Post } from '@/types/source';

type Props = Pick<Post, 'date' | 'updated'>;

const PostDate: FC<Props> = ({ date, updated }) => {
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
  color: var(--text-11);
`;

const PostDateItem = styled.div<{ existModified?: boolean }>`
  display: flex;
  align-items: center;
  color: var(--text-11);
  font-size: var(--font-size-md);

  ${({ existModified }) => {
    return (
      existModified &&
      css`
        opacity: 0.8;
        text-decoration: line-through;
      `
    );
  }}

  &:not(:first-child) {
    margin-left: 0.5em;
  }
`;
