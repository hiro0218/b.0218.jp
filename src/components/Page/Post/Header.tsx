import type { ReactNode } from 'react';

import { PostDate } from '@/components/Page/_shared/Date';
import type { PostTagItem } from '@/components/Page/_shared/Tag';
import { PostTag } from '@/components/Page/_shared/Tag';
import { Cluster } from '@/components/UI/Layout/Cluster';
import { Stack } from '@/components/UI/Layout/Stack';
import type { Post } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = Pick<Post, 'title' | 'date' | 'updated'> & {
  tagsWithCount: PostTagItem[];
  children?: ReactNode;
};

export function PostHeader({ title, date, updated, tagsWithCount, children }: Props) {
  return (
    <Stack as="header" className={headerSeparatorStyle} gap={400}>
      <Stack gap={300}>
        {/**
         * Bridgy Fed 向けの microformats2 のクラスは、UI/ 側の部品に持たせず、このページ（h-entry）でだけ付ける。
         * UI/ 側を汎用のまま保つため
         */}
        <Heading className="p-name">{title}</Heading>
        <Meta>
          <PostDate date={date} publishedClassName="dt-published" updated={updated} updatedClassName="dt-updated" />
          <Cluster isWide={false}>
            <PostTag labelClassName="p-category" size="chip" tags={tagsWithCount} />
          </Cluster>
        </Meta>
      </Stack>
      {children}
    </Stack>
  );
}

const headerSeparatorStyle = css`
  &::after {
    display: block;
    width: 100%;
    height: var(--spacing-75);
    color: var(--colors-gray-400);
    content: '';
    background-image: repeating-linear-gradient(-45deg, currentColor, currentColor 1px, transparent 0, transparent 50%);
    background-size: 6px 6px;
  }
`;

const Heading = styled.h1`
  /* 見出しの大きさをベース CSS の h1（30→34px）のままにしない。本文の h2（30px）との比が 1.13 しかなく、題名が本文の見出しに埋もれるため */
  font-size: var(--font-sizes-display);
  font-weight: var(--font-weights-bolder);
  font-feature-settings: 'palt';
  font-kerning: normal;
  /* 行の高さを xs（1.25）にしない。2〜3 行に折り返す記事タイトルで、行どうしが詰まるため */
  line-height: var(--grid-line-height-sm);
  word-break: auto-phrase;
  text-wrap: balance;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-100);
  column-gap: var(--spacing-300);
  align-items: center;
  /* 日付の字を UI の本文（16px・等幅でない）にしない。タグ（14px）より日付だけが大きく、行の中で目立つため */
  font-size: var(--font-sizes-sm);
  /* 行の高さを body（32px）にしない。資料の日付の行（24px）と一致しないため */
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-900);

  time {
    font-family: var(--fonts-family-monospace);
  }
`;
