import Link from 'next/link';
import type { ComponentProps } from 'react';

import { PostDate } from '@/components/UI/Date';
import type { HeadingLevel } from '@/components/UI/Heading';
import { Stack } from '@/components/UI/Layout/Stack';
import type { TagCategoryName } from '@/types/source';
import { css } from '@/ui/styled';

import { Header } from './ArticleCard/Header';
import { Tags } from './ArticleCard/Tags';

type PostDateProps = ComponentProps<typeof PostDate>;

type Props = {
  link: string;
  title: string;
  /** 見出しの HTML 要素。一覧ページでは h2、単体では h3 が典型 */
  titleTagName?: HeadingLevel;
  date: PostDateProps['date'];
  updated?: PostDateProps['updated'];
  tags?: string[];
  /** 記事カテゴリ。アイコンと背景色が変わる */
  category?: TagCategoryName;
  /** Next.js のルートプリフェッチを有効にする */
  prefetch?: boolean;
};

/**
 * ブログ記事の一覧表示用カード。タイトル・日付・カテゴリ・タグを表示する。
 * コンテナクエリでレスポンシブに対応し、狭い幅ではタグが非表示になる。
 * @summary 記事一覧用カード（レスポンシブ対応）
 */
export function ArticleCard({
  link,
  title,
  date,
  updated,
  tags,
  category,
  titleTagName = 'h3',
  prefetch = false,
}: Props) {
  const Title = titleTagName;

  return (
    <Stack className={containerStyle} gap={100}>
      <Header category={category}>
        <PostDate date={date} updated={updated} />
      </Header>
      <Link className={anchorStyle} href={link} prefetch={prefetch}>
        <Title className={titleStyle}>{title}</Title>
      </Link>
      {!!tags && <Tags tags={tags} />}
    </Stack>
  );
}

const containerStyle = css`
  --container-space: var(--spacing-400);
  --hover-color: var(--colors-accent-1100);

  contain-intrinsic-size: 0 200px;
  padding: var(--container-space);
  contain: layout style;
  container-type: inline-size;
  content-visibility: auto;
  background-color: var(--colors-white);
  border-radius: var(--radii-sm);
  box-shadow: 0 0 0 var(--border-widths-thin) var(--colors-gray-200);
  transition: box-shadow var(--transition-slow);

  &:hover,
  &:focus,
  &:focus-within {
    box-shadow: 0 0 0 var(--border-widths-thin) var(--hover-color);
  }

  &:active {
    box-shadow: 0 0 0 var(--border-widths-medium) var(--hover-color);
  }

  time {
    font-size: var(--font-sizes-sm);
    line-height: var(--grid-line-height-sm);
  }
`;

const anchorStyle = css`
  &::before {
    position: absolute;
    inset: 0;
    z-index: var(--z-index-base);
    width: 100%;
    height: 100%;
    cursor: pointer;
    content: '';
  }

  &:hover,
  &:focus,
  &:focus-within {
    & > * {
      color: var(--hover-color);
    }
  }

  &:focus-within {
    box-shadow: none;
  }
`;

// 行数の上限（line-clamp）を付けない。付けると、関連記事の題名の大半が途中で切れる。
// word-break: break-all にしない。英単語が DATABA|SE のように途中で折れる
const titleStyle = css`
  font-size: var(--font-sizes-sm);
  font-weight: var(--font-weights-bold);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-1000);
  letter-spacing: var(--letter-spacings-sm);
  word-break: auto-phrase;
  overflow-wrap: anywhere;
  transition: color var(--transition-slow);
`;
