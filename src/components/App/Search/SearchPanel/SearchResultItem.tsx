import { HashtagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Fragment, type Ref } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import { convertPostSlugToPath } from '@/lib/utils/url';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { cx } from '@/ui/styled';
import type { MatchedIn } from '../types';
import { AnchorStyle, FocusedContainerStyle, LinkContainerStyle } from './SearchResultItem.styles';
import type { TitleSegment } from './utils/markEscapedHTML';

type SearchResultItemProps = {
  id: string;
  index: number;
  slug: string;
  titleSegments: TitleSegment[];
  isFocused: boolean;
  matchedIn: MatchedIn;
  onLinkClick?: () => void;
  onMouseMove: (index: number) => void;
  ref?: Ref<HTMLDivElement>;
};

/**
 * 検索結果アイテム
 *
 * @description
 * 個別の検索結果を表示するコンポーネント。
 * キーボードナビゲーションに対応し、フォーカス状態を視覚的に表現します。
 * リンク自体に roving tabindex を適用し、フォーカス中の項目だけをタブ順に含める。
 */
export function SearchResultItem({
  id,
  index,
  slug,
  titleSegments,
  isFocused,
  matchedIn,
  onLinkClick,
  onMouseMove,
  ref,
}: SearchResultItemProps) {
  const link = convertPostSlugToPath(slug);
  const handleMouseMove = () => {
    onMouseMove(index);
  };

  return (
    <div
      aria-selected={isFocused}
      className={cx(LinkContainerStyle, isFocused ? FocusedContainerStyle : undefined)}
      data-selected={isFocused}
      id={id}
      onMouseMove={handleMouseMove}
      ref={ref}
      role="option"
      tabIndex={-1}
    >
      <Anchor className={AnchorStyle} href={link} onClick={onLinkClick} prefetch={false} tabIndex={-1}>
        {matchedIn === 'tag' ? (
          <HashtagIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
        ) : (
          <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
        )}
        <span>
          {titleSegments.map((segment) =>
            segment.marked ? (
              <mark key={segment.start}>{segment.text}</mark>
            ) : (
              <Fragment key={segment.start}>{segment.text}</Fragment>
            ),
          )}
        </span>
      </Anchor>
    </div>
  );
}
