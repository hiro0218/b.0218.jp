import type { ReactNode } from 'react';

import { PostDate } from '@/components/UI/Date';
import { Cluster } from '@/components/UI/Layout/Cluster';
import { Stack } from '@/components/UI/Layout/Stack';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import { PostTag } from '@/components/UI/Tag';
import type { Post } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = Pick<Post, 'title' | 'date' | 'updated'> & {
  tagsWithCount: PostTagProps[];
  render?: ReactNode;
};

export function PostHeader({ title, date, updated, tagsWithCount, render }: Props) {
  return (
    <Stack as="header" className={headerSeparatorStyle} gap={300}>
      {/**
       * Bridgy Fed 向け microformats2 のためのクラスを付与
       * p-name / dt-published / dt-updated / p-category は Bridgy Fed 向け microformats2
       * （constants.ts の BRIDGY_FED_URL 参照）。このページ(h-entry)だけに閉じるようここで付与し、UI/ 側は汎用のまま保つ
       */}
      <Heading className="p-name">{title}</Heading>
      <Stack className={itemStyle} gap={300}>
        <PostDate date={date} publishedClassName="dt-published" updated={updated} updatedClassName="dt-updated" />
        <Cluster isWide={false}>
          <PostTag hasCategoryMicroformat={true} tags={tagsWithCount} />
        </Cluster>
      </Stack>
      {render}
    </Stack>
  );
}

const headerSeparatorStyle = css`
  &::after {
    display: block;
    width: 100%;
    height: var(--spacing-75);
    margin-top: var(--spacing-600);
    color: var(--colors-gray-400);
    content: '';
    background-image: repeating-linear-gradient(-45deg, currentColor, currentColor 1px, transparent 0, transparent 50%);
    background-size: 6px 6px;
  }
`;

const Heading = styled.h1`
  font-weight: var(--font-weights-bolder);
  font-feature-settings: 'palt';
  font-kerning: normal;
  line-height: var(--line-heights-heading-tight);
  word-break: auto-phrase;
  text-wrap: balance;
`;

const itemStyle = css`
  color: var(--colors-gray-900);
`;
