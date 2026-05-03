import { Anchor } from '@/components/UI/Anchor';
import { tagPath } from '@/lib/tag/navigation';
import { styled } from '@/ui/styled';
import { postTagAnchor } from '@/ui/styled/components/postTagAnchor';

export type Props = {
  slug: string;
  /** タグに紐づく記事数 */
  count?: number;
  /** タグページへのリンクを有効にする */
  isNavigable?: boolean;
};

type PostTagProps = {
  tags: Props[];
  /** rel="tag" 属性を付与する */
  hasRelTag?: boolean;
};

/**
 * 記事に付与されたタグ一覧を表示する。リンク付きとテキストのみの混在に対応。
 * @summary 記事タグ一覧（リンク/テキスト混在対応）
 */
export function PostTag({ tags, hasRelTag = true }: PostTagProps) {
  if (tags.length === 0) {
    return null;
  }

  const sortedTags = tags.toSorted((a, b) => {
    if (a.count === undefined && b.count === undefined) return 0;
    if (a.count === undefined) return 1;
    if (b.count === undefined) return -1;

    return b.count - a.count;
  });

  return (
    <>
      {sortedTags.map(({ slug, count, isNavigable }) => {
        const isAnchor = isNavigable ?? false;

        return isAnchor ? (
          <Anchor
            aria-label={count != null ? `${slug}（${count}件）` : undefined}
            className={postTagAnchor}
            href={tagPath(slug)}
            key={slug}
            {...(hasRelTag && {
              rel: 'tag',
            })}
          >
            {slug}
            {count != null && <Count aria-hidden="true">{count}</Count>}
          </Anchor>
        ) : (
          <span aria-hidden="true" className={postTagAnchor} key={slug}>
            {slug}
          </span>
        );
      })}
    </>
  );
}

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  padding: 0 var(--spacing-½);
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-xs);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  user-select: none;
  background-color: var(--colors-gray-a-100);
  border-radius: var(--radii-md);
`;
