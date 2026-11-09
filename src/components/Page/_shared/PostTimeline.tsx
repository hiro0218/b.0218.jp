import Link from 'next/link';
import { PostTag } from '@/components/Page/_shared/Tag';
import { timelineGrid, timelineMainColumn, timelineSideColumn } from '@/components/Page/_shared/timelineGrid';
import type { HeadingLevel } from '@/components/UI/Heading';
import { Cluster } from '@/components/UI/Layout/Cluster';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { ArticleSummary } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = {
  posts: ArticleSummary[];
  prefetch?: boolean;
  /** 呼び出し元セクション見出しの次のレベルを渡す（既定 h3） */
  titleTagName?: HeadingLevel;
};

/**
 * タグをリンクにしない。行全体が題名のリンクになるため。
 * 日付は呼び出し側が表示用（YYYY/MM/DD。getDateAndUpdatedToSimpleFormat）に整えた値を、そのまま出す。
 * @summary 記事タイムラインリスト
 */
export const PostTimeline = ({ posts, prefetch = false, titleTagName = 'h3' }: Props) => {
  if (posts.length === 0) {
    return null;
  }

  const Title = titleTagName;

  return (
    <Root>
      <List>
        {posts.map((post) => {
          const link = convertPostSlugToPath(post.slug);
          const tags = post.tags ?? [];

          return (
            <Item className={timelineGrid} key={post.slug}>
              <Time className={timelineSideColumn} dateTime={post.date}>
                {post.date}
              </Time>
              <Body className={timelineMainColumn}>
                <Title className={titleStyle}>
                  <Link className={titleAnchorStyle} data-row-link href={link} prefetch={prefetch}>
                    {post.title}
                  </Link>
                </Title>
                {tags.length > 0 && (
                  <Cluster gap={100}>
                    <PostTag size="chip" tags={tags.map((slug) => ({ slug }))} />
                  </Cluster>
                )}
              </Body>
            </Item>
          );
        })}
      </List>
    </Root>
  );
};

// 負の margin は、Root でなく内側の List にだけ置く。Root 自身は margin を持たないため（Zero Margin Principle）
const Root = styled.div`
  display: flow-root;
`;

const List = styled.ol`
  --resize-dur: 500ms;
  --timeline-item-pad-y: var(--spacing-400);
  position: relative;
  margin-top: calc(var(--timeline-item-pad-y) * -1);
  margin-bottom: calc(var(--timeline-item-pad-y) * -1);
  container-type: inline-size;
  isolation: isolate;
  transition: opacity var(--transition-slow);

  /* 他の行の不透明度を 0.6・0.8 にしない。文字は不透明度の分だけ地（#f8f8f8）に近づき、タグ（面 #e2e2e2 の上の gray-700）が 4.5:1 を割る。
     0.8 は 3.89:1 で、0.87 以上なら 4.5:1 を保てる */
  &:has(a[data-row-link]:hover) > li:not(:has(a[data-row-link]:hover)) {
    opacity: 0.9;
  }

  /* 未対応環境は li 自身の hover 背景を使い、対応環境だけ追随背景へ切り替える */
  @supports (anchor-scope: --post-timeline-item) and (position-anchor: --post-timeline-item) and (top: anchor(top)) and
    (width: anchor-size(width)) and selector(:has(*)) {
    anchor-scope: --post-timeline-item;

    &::after {
      position: absolute;
      top: anchor(top, 0);
      left: anchor(left, 0);
      z-index: 0;
      width: anchor-size(width, 0);
      height: anchor-size(height, 0);
      position-anchor: --post-timeline-item;
      pointer-events: none;
      content: '';
      background-color: var(--colors-gray-a-75);
      border-radius: var(--radii-md);
      opacity: 0;
      transition: none;
    }

    &:has(a[data-row-link]:is(:hover, :focus-visible))::after {
      opacity: 1;
      transition:
        top var(--resize-dur) var(--easings-ease-spring2),
        left var(--resize-dur) var(--easings-ease-spring2),
        width var(--resize-dur) var(--easings-ease-spring2),
        height var(--resize-dur) var(--easings-ease-spring2),
        transform var(--transition-fast),
        background-color var(--transition-fast),
        opacity var(--transition-fast);
      will-change: top, left, width, height, transform;
    }

    &:has(a[data-row-link]:active)::after {
      background-color: var(--colors-gray-a-300);
    }

    @media (prefers-reduced-motion: reduce) {
      &::after {
        transition: none !important;
        will-change: auto;
      }
    }
  }
`;

const Item = styled.li`
  position: relative;
  row-gap: var(--spacing-75);
  padding: var(--timeline-item-pad-y) var(--spacing-300);
  margin-right: calc(var(--spacing-300) * -1);
  margin-left: calc(var(--spacing-300) * -1);
  border-radius: var(--radii-md);
  transition:
    background-color var(--transition-fast),
    opacity var(--transition-fast),
    transform var(--transition-fast);

  @media (prefers-reduced-motion: reduce) {
    transition: background-color var(--transition-fast);
  }

  &:has(a[data-row-link]:hover) {
    background-color: var(--colors-gray-a-75);
  }

  &:has(a[data-row-link]:active) {
    background-color: var(--colors-gray-a-300);
  }

  &:has(a[data-row-link]:focus-visible) {
    outline: var(--border-widths-medium) solid var(--colors-focus-ring);
    outline-offset: var(--border-widths-medium);
  }

  @supports (anchor-scope: --post-timeline-item) and (position-anchor: --post-timeline-item) and (top: anchor(top)) and
    (width: anchor-size(width)) and selector(:has(*)) {
    z-index: var(--z-index-base);

    &:first-child {
      anchor-name: --post-timeline-item;
    }

    &:has(a[data-row-link]:is(:hover, :focus-visible)) {
      anchor-name: --post-timeline-item;
      background-color: transparent;
    }

    &:has(a[data-row-link]:active) {
      background-color: transparent;
    }

    /* hover 中は、hover した行以外を追随の基準にしない。キーボードの焦点が別の行に残っていると、hover を無視してその行へ追随するため */
    ol:has(a[data-row-link]:hover) > &:not(:has(a[data-row-link]:hover)) {
      anchor-name: none;
    }
  }

  @container (min-width: 40rem) {
    align-items: baseline;
  }
`;

const Time = styled.time`
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-sm);
  line-height: var(--grid-line-height-body);
  color: var(--colors-gray-700);
  white-space: nowrap;

  @container (min-width: 40rem) {
    line-height: 1;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-100);
`;

const titleStyle = css`
  font-size: var(--font-sizes-lg);
  /* 題名の太さを 700 にしない。一覧のページで文字の大半が太字になると、見出しは目立たないため */
  font-weight: var(--font-weights-normal);
  /* 行の高さを見出しと同じ sm（28px）にしない。2 行に折り返すと、本文より行が詰まって見えるため */
  line-height: var(--grid-line-height-md);
  color: var(--colors-gray-900);
  word-break: auto-phrase;
  /* global の h1-h6 balance と同値だが意図を固定する明示。pretty は CJK 混在タイトルの孤立行に効かず、balance は行数を増やさずに解消する（一覧 610 件でも再レイアウト負荷は誤差） */
  text-wrap: balance;

  a {
    color: inherit;
    transition: color var(--transition-fast);
  }
`;

const titleAnchorStyle = css`
  &::before {
    position: absolute;
    inset: 0;
    cursor: pointer;
    content: '';
  }

  /* 焦点の枠で題名の文字だけを囲まず、行（Item）に出す。行全体が題名のリンクの押せる範囲になるため */
  &:focus-visible {
    box-shadow: none;
  }
`;
