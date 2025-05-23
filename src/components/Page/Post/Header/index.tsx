import type { ReactNode } from 'react';

import PostDate from '@/components/UI/Date';
import { Box, Cluster, Stack } from '@/components/UI/Layout';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import PostTag from '@/components/UI/Tag';
import type { PostProps } from '@/types/source';
import { css, styled } from '@/ui/styled/static';

type Props = Pick<PostProps, 'title' | 'date' | 'updated'> & {
  tagsWithCount: PostTagProps[];
  render?: ReactNode;
};

function PostHeader({ title, date, updated, tagsWithCount, render }: Props) {
  return (
    <Stack as="header" className={headerSeparatorStyle} space={2}>
      <Heading>{title}</Heading>
      <Box mt={2}>
        <Box className={itemStyle}>
          <PostDate date={date} updated={updated} />
          {/* <span aria-hidden="true">•</span> */}
        </Box>
        <Box className={itemStyle} mt={1}>
          <Cluster isWide={false}>
            <PostTag tags={tagsWithCount} />
          </Cluster>
        </Box>
      </Box>
      {render}
    </Stack>
  );
}

export default PostHeader;

const headerSeparatorStyle = css`
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
  font-weight: var(--font-weight-bolder);
  font-feature-settings: 'palt';
  font-kerning: normal;
  line-height: var(--line-height-lg);
  word-break: auto-phrase;
  text-wrap: pretty;
`;

const itemStyle = css`
  display: flex;
  color: var(--color-gray-11);
`;
