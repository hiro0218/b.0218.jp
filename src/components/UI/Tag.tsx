import Link from 'next/link';
import { tagPath } from '@/lib/tag/navigation';
import { css, cx, styled } from '@/ui/styled';
import { postTagAnchor } from '@/ui/styled/components/postTagAnchor';

export type PostTagItem = {
  slug: string;
  /** タグに紐づく記事数 */
  count?: number;
  /** タグページへのリンクを有効にする */
  isNavigable?: boolean;
};

type PostTagProps = {
  tags: PostTagItem[];
  /** 大きさ。chip は記事の冒頭・一覧の行の小さい形、pill はタグの一覧の大きい形 */
  size: 'chip' | 'pill';
  /** タグ名に付けるクラス（microformats2 の p-category など）。リンクはタグ名を包む span に、リンクでないタグは span 自身に付く */
  labelClassName?: string;
};

const chipStyle = css`
  padding: var(--spacing-50) var(--spacing-100);
  font-size: var(--font-sizes-sm);
  /* 行の高さを 21px のままにしない。行の中のタグが 25px になり、4px の縦グリッドに乗らないため */
  line-height: var(--grid-line-height-sm);
  border-radius: var(--radii-md);

  &:is(a) {
    min-width: var(--tap-target-inline);
    min-height: var(--tap-target-inline);
  }
`;

const pillStyle = css`
  padding: var(--spacing-75) var(--spacing-300);
  font-size: var(--font-sizes-sm);
  /* 行の高さを文字の大きさ（14px）の sm（24px）にしない。pill の文字を本文（16px）へ寄せたときに、高さが変わってしまう */
  line-height: var(--grid-line-height-body);
  border-radius: var(--radii-md);

  &:is(a) {
    min-height: var(--control-min-size);
  }
`;

const sizeStyle = { chip: chipStyle, pill: pillStyle };

/**
 * 記事に付与されたタグ一覧を表示する。リンク付きとテキストのみの混在に対応。
 * @summary 記事タグ一覧（リンク/テキスト混在対応）
 */
export function PostTag({ tags, size, labelClassName }: PostTagProps) {
  if (tags.length === 0) {
    return null;
  }

  const sortedTags = tags.toSorted((a, b) => {
    if (a.count === undefined && b.count === undefined) return 0;
    if (a.count === undefined) return 1;
    if (b.count === undefined) return -1;

    return b.count - a.count;
  });
  const tagClassName = cx(postTagAnchor, sizeStyle[size]);

  return (
    <>
      {sortedTags.map(({ slug, count, isNavigable }) => {
        const isAnchor = isNavigable ?? false;

        return isAnchor ? (
          <Link className={tagClassName} href={tagPath(slug)} key={slug} rel="tag">
            {/**
             * noLeakedRender は三項演算子の else 側に変数を置くと指摘する（slug は string でリークしない）。
             * 回避のため否定条件で分岐を入れ替えており、span を常に付けると DOM が変わるため採らない
             */}
            {!labelClassName ? slug : <span className={labelClassName}>{slug}</span>}
            {/**
             * aria-label は使わない。可視テキスト（slug+件数）とラベルの文字列が一致しないと
             * WCAG 2.5.3 (Label in Name) 違反になるため、可視テキストの並びに「件」だけ読み上げ用に足す
             */}
            {count != null && (
              <Count>
                {count}
                <span className="sr-only">件</span>
              </Count>
            )}
          </Link>
        ) : (
          <span aria-hidden="true" className={cx(tagClassName, labelClassName)} key={slug}>
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
  padding: 0 var(--spacing-75);
  font-variant-numeric: tabular-nums;
  line-height: var(--grid-line-height-sm);
  user-select: none;
  border-radius: var(--radii-md);
`;
