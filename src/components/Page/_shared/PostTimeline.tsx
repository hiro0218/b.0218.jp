import { Anchor } from '@/components/UI/Anchor';
import { Cluster } from '@/components/UI/Layout/Cluster';
import { PostTag } from '@/components/UI/Tag';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { ArticleSummary } from '@/types/source';
import { css, styled } from '@/ui/styled';

type Props = {
  posts: ArticleSummary[];
  prefetch?: boolean;
};

const formatTimelineDate = (date: string) => {
  const [datePart] = date.split('T');
  return datePart.replaceAll('-', '/');
};

/**
 * 記事を縦タイムライン形式で表示する。左の縦罫線と各項目頭の円ドットで時系列の連続性を示す。
 * @summary 記事タイムラインリスト
 */
export const PostTimeline = ({ posts, prefetch = false }: Props) => {
  if (posts.length === 0) {
    return null;
  }

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
              <Title>
                <Anchor className={titleAnchorStyle} href={link} prefetch={prefetch}>
                  {post.title}
                </Anchor>
              </Title>
              {tags.length > 0 && (
                <Cluster className={tagsStyle} gap={1}>
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
  --timeline-gutter: var(--spacing-3);
  --timeline-item-pad-y: var(--spacing-2);
  --timeline-date-col: var(--spacing-6);
  --timeline-line-offset: var(--spacing-1);
  --timeline-dot-size: calc((var(--spacing-1) + var(--spacing-2)) / 2);
  --timeline-dot-top: calc(
    var(--timeline-item-pad-y) + (var(--font-sizes-md) * var(--line-heights-sm) - var(--timeline-dot-size)) / 2
  );
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
  padding-inline-start: var(--timeline-gutter);
  container-type: inline-size;
  isolation: isolate;

  &::before {
    position: absolute;
    top: var(--timeline-line-offset);
    bottom: var(--timeline-line-offset);
    left: var(--timeline-line-offset);
    width: var(--border-widths-thin);
    content: '';
    background-color: var(--colors-gray-100);
  }

  /* 未対応環境は li 自身の hover 背景を使い、対応環境だけ追随背景へ切り替える */
  @supports (anchor-scope: --post-timeline-item) and (position-anchor: --post-timeline-item) and
    (top: anchor(top)) and (width: anchor-size(width)) and selector(:has(*)) {
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
        top var(--transition-fast),
        left var(--transition-fast),
        width var(--transition-fast),
        height var(--transition-fast),
        background-color var(--transition-fast),
        opacity var(--transition-fast);
    }

    &:has(> li:active)::after {
      background-color: var(--colors-gray-a-200);
    }
  }
`;

const Item = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: var(--timeline-date-col) 1fr;
  gap: var(--spacing-2);
  align-items: baseline;
  padding: var(--timeline-item-pad-y) var(--spacing-2);
  border-radius: var(--radii-sm);
  transition: background-color var(--transition-fast);

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

  &:active {
    background-color: var(--colors-gray-a-200);
  }

  @supports (anchor-scope: --post-timeline-item) and (position-anchor: --post-timeline-item) and
    (top: anchor(top)) and (width: anchor-size(width)) and selector(:has(*)) {
    z-index: var(--z-index-base);

    &:first-child {
      anchor-name: --post-timeline-item;
    }

    &::after {
      position: absolute;
      inset: calc(var(--spacing-1) / -2) 0;
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
    }

    ol:has(> li:hover) > &:focus-within:not(:hover) {
      anchor-name: none;
    }
  }

  @container (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2);
  }
`;

const Time = styled.time`
  font-size: var(--font-sizes-sm);
  font-variant-numeric: tabular-nums;
  color: var(--colors-gray-600);
  white-space: nowrap;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  min-width: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
  line-height: var(--line-heights-sm);
  letter-spacing: var(--letter-spacings-sm);
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
    padding: var(--spacing-½) var(--spacing-1);
    font-size: var(--font-sizes-xs);
    border-radius: var(--radii-sm);
  }
`;
