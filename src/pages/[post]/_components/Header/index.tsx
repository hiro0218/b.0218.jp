import type { ReactNode } from 'react';

import PostDate from '@/components/UI/Date';
import { Cluster, Stack } from '@/components/UI/Layout';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag from '@/components/UI/Tag';
import { READ_TIME_SUFFIX } from '@/constant';
import type { PostProps } from '@/types/source';
import { css, styled } from '@/ui/styled/static';

type Props = Pick<PostProps, 'title' | 'date' | 'updated' | 'readingTime'> & {
  tagsWithCount: PostTagProps[];
  render?: ReactNode;
};

function PostHeader({ title, date, updated, readingTime, tagsWithCount, render }: Props) {
  return (
    <Stack as="header" className={ContainerStyle}>
      <Heading>{title}</Heading>
      <Stack space={1}>
        <Item>
          <PostDate date={date} updated={updated} />
          <Separator aria-hidden="true">•</Separator>
          <span>{`${readingTime || 1} ${READ_TIME_SUFFIX}`}</span>
        </Item>
        <Item>
          <Cluster isWide={false}>
            <PostTag tags={tagsWithCount} />
          </Cluster>
        </Item>
      </Stack>
      {render}
    </Stack>
  );
}

export default PostHeader;

const ContainerStyle = css`
  &::after {
    display: block;
    width: 100%;
    height: var(--space-½);
    margin-top: var(--space-4);
    color: var(--color-gray-6);
    content: '';
    background-image: repeating-linear-gradient(-45deg, currentColor, currentColor 1px, transparent 0, transparent 50%);
    background-size: 6px 6px;
  }
`;

const Heading = styled.h1`
  font-feature-settings: 'palt';
  font-kerning: normal;
  line-height: var(--line-height-lg);
  word-break: auto-phrase;
  text-wrap: pretty;
`;

const Item = styled.div`
  display: flex;
  color: var(--color-gray-11);
`;

const Separator = styled.span`
  margin: 0 var(--space-1);
  user-select: none;
`;
