import { forwardRef, memo } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import { convertPostSlugToPath } from '@/lib/utils/url';
import { HashtagIcon, ICON_SIZE_XS, MagnifyingGlassIcon } from '@/ui/icons/index';
import { cx } from '@/ui/styled';
import type { MatchedIn } from '../types';
import { AnchorStyle, FocusedContainerStyle, LinkContainerStyle } from './SearchResultItem.styles';

type SearchResultItemProps = {
  slug: string;
  title: string;
  isFocused: boolean;
  matchedIn: MatchedIn;
  onLinkClick?: () => void;
};

/**
 * 検索結果アイテム
 *
 * @description
 * 個別の検索結果を表示するコンポーネント。
 * キーボードナビゲーションに対応し、フォーカス状態を視覚的に表現します。
 */
const SearchResultItemBase = forwardRef<HTMLDivElement, SearchResultItemProps>(
  ({ slug, title, isFocused, matchedIn, onLinkClick }, ref) => {
    const link = convertPostSlugToPath(slug);

    return (
      <div
        className={cx(LinkContainerStyle, isFocused ? FocusedContainerStyle : undefined)}
        ref={ref}
        tabIndex={isFocused ? 0 : -1}
      >
        <Anchor className={AnchorStyle} href={link} onClick={onLinkClick} prefetch={false}>
          {matchedIn === 'tag' ? (
            <HashtagIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          ) : (
            <MagnifyingGlassIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          )}
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </Anchor>
      </div>
    );
  },
);

SearchResultItemBase.displayName = 'SearchResultItem';

export const SearchResultItem = memo(SearchResultItemBase);
