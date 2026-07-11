import { Anchor } from '@/components/UI/Anchor';
import { Cluster } from '@/components/UI/Layout/Cluster';
import { PostTag } from '@/components/UI/Tag';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { ArticleSummary } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = {
  posts: ArticleSummary[];
  prefetch?: boolean;
  /** 呼び出し元セクション見出しの次のレベルを渡す（既定 h3） */
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

const formatTimelineDate = (date: string) => {
  const [datePart] = date.split('T');
  return datePart.replaceAll('-', '/');
};

/**
 * 記事を縦タイムライン形式で表示する。左の縦罫線と各項目頭の円ドットで時系列の連続性を示す。
 * @summary 記事タイムラインリスト
 */
export const PostTimeline = ({ posts, prefetch = false, titleTagName = 'h3' }: Props) => {
  if (posts.length === 0) {
    return null;
  }

  const Title = titleTagName;

  return (
    <List>
      {posts.map((post) => {
        const link = convertPostSlugToPath(post.slug);
        const display = formatTimelineDate(post.date);
        const tags = post.tags ?? [];

        return (
          <Item key={post.slug}>
            <Time dateTime={post.date}>{display}</Time>
            <Body>
              <Title className={titleStyle}>
                <Anchor className={titleAnchorStyle} href={link} prefetch={prefetch}>
                  {post.title}
                </Anchor>
              </Title>
              {tags.length > 0 && (
                <Cluster className={tagsStyle} gap={100}>
                  <PostTag tags={tags.map((slug) => ({ slug }))} />
                </Cluster>
              )}
            </Body>
          </Item>
        );
      })}
    </List>
  );
};

const List = styled.ol`
  --resize-dur: 500ms;
  --timeline-gutter: var(--spacing-400);
  --timeline-item-pad-y: var(--spacing-300);
  --timeline-date-col: var(--spacing-1000);
  --timeline-line-offset: var(--spacing-100);
  --timeline-dot-size: var(--spacing-200);
  --timeline-dot-top: calc(
    var(--timeline-item-pad-y) + (var(--font-sizes-md) * var(--line-heights-sm) - var(--timeline-dot-size)) / 2
  );
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-100);
  padding-inline-start: var(--timeline-gutter);
  container-type: inline-size;
  isolation: isolate;
  transition: opacity var(--transition-slow);

  &::before {
    position: absolute;
    top: var(--timeline-line-offset);
    bottom: var(--timeline-line-offset);
    left: var(--timeline-line-offset);
    width: var(--border-widths-thin);
    content: '';
    background-color: var(--colors-gray-100);
  }

  /* hoverしていない他の要素 */
  &:has(> li:hover) > li:not(:hover) {
    opacity: 0.6;
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
      background-color: var(--colors-gray-a-100);
      border-radius: var(--radii-sm);
      opacity: 0;
      transition: none;
    }

    &:has(> li:is(:hover, :focus-within))::after {
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

    &:has(> li:active)::after {
      background-color: var(--colors-gray-a-200);
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
  display: grid;
  grid-template-columns: var(--timeline-date-col) 1fr;
  gap: var(--spacing-300);
  align-items: baseline;
  padding: var(--timeline-item-pad-y) var(--spacing-300);
  border-radius: var(--radii-sm);
  transition:
    background-color var(--transition-fast),
    opacity var(--transition-fast),
    transform var(--transition-fast);

  @media (prefers-reduced-motion: reduce) {
    transition: background-color var(--transition-fast);
  }

  /* dot */
  &::before {
    position: absolute;
    top: var(--timeline-dot-top);
    left: calc(var(--timeline-line-offset) - (var(--timeline-gutter) + var(--timeline-dot-size) / 2));
    width: var(--timeline-dot-size);
    height: var(--timeline-dot-size);
    content: '';
    background-color: var(--colors-gray-200);
    border: var(--border-widths-medium) solid var(--colors-gray-500);
    border-radius: var(--radii-full);
    box-shadow: 0 0 0 3px var(--colors-body-background);
    transition:
      background-color var(--transition-fast),
      border-color var(--transition-fast);
  }

  &:hover,
  &:focus-within {
    background-color: var(--colors-gray-a-100);

    /* dot */
    &::before {
      background-color: var(--colors-gray-1000);
      border-color: var(--colors-gray-1000);
    }
  }

  @supports (anchor-scope: --post-timeline-item) and (position-anchor: --post-timeline-item) and (top: anchor(top)) and
    (width: anchor-size(width)) and selector(:has(*)) {
    z-index: var(--z-index-base);

    &:first-child {
      anchor-name: --post-timeline-item;
    }

    &::after {
      position: absolute;
      inset: calc(var(--spacing-100) / -2) 0;
      z-index: -1;
      content: '';
    }

    &:hover,
    &:focus-within {
      anchor-name: --post-timeline-item;
      background-color: transparent;
    }

    &:active {
      background-color: transparent;
      transform: none;
    }

    ol:has(> li:hover) > &:focus-within:not(:hover) {
      anchor-name: none;
    }
  }

  @container (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-100);
  }
`;

const Time = styled.time`
  font-size: var(--font-sizes-sm);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-600);
  white-space: nowrap;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-300);
  min-width: 0;
`;

const titleStyle = css`
  margin: 0;
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-sm);
  letter-spacing: var(--letter-spacings-sm);
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
    z-index: var(--z-index-base);
    cursor: pointer;
    content: '';
  }
`;

const tagsStyle = css`
  /* PostTag は tag の navigable 状態で anchor/span を切り替えるため両方に適用 */
  > :where(a, span) {
    min-height: auto;
    padding: var(--spacing-75) var(--spacing-100);
    font-size: var(--font-sizes-xs);
    border-radius: var(--radii-sm);
  }
`;
