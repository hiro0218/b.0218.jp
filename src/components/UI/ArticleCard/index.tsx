import type { ComponentProps, ReactNode } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import PostDate from '@/components/UI/Date';
import { Stack } from '@/components/UI/Layout';
import type { TagCategoryName } from '@/types/source';
import { css, cx } from '@/ui/styled';

import { ArticleCardExcerpt } from './ArticleCardExcerpt';
import { ArticleCardHeader } from './ArticleCardHeader';
import { ArticleCardTags } from './ArticleCardTags';

type PostDateProps = ComponentProps<typeof PostDate>;

type Props = {
  link: string;
  title: string;
  /** 見出しの HTML 要素。一覧ページでは h2、単体では h3 が典型 */
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  excerpt?: ReactNode | string;
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
function ArticleCard({
  link,
  title,
  date,
  updated,
  excerpt,
  tags,
  category,
  titleTagName = 'h3',
  prefetch = false,
}: Props) {
  const Title = titleTagName;

  return (
    <Stack className={containerStyle} gap={1}>
      <ArticleCardHeader category={category}>
        <PostDate date={date} updated={updated} />
      </ArticleCardHeader>
      <Anchor className={anchorStyle} href={link} prefetch={prefetch}>
        <Title className={cx('line-clamp-2', titleStyle)}>{title}</Title>
      </Anchor>
      {!!excerpt && <ArticleCardExcerpt excerpt={excerpt} />}
      {!!tags && <ArticleCardTags tags={tags} />}
    </Stack>
  );
}

export default ArticleCard;

const containerStyle = css`
  --container-space: var(--spacing-3);
  --hover-color: var(--colors-accent-1100);

  contain-intrinsic-size: 0 200px;
  padding: var(--container-space);
  contain: layout style;
  container-type: inline-size;
  content-visibility: auto;
  word-break: break-all;
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
    line-height: var(--line-heights-xs);
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

const titleStyle = css`
  font-size: var(--font-sizes-sm);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-md);
  color: var(--colors-gray-1000);
  transition: color var(--transition-slow);
`;
