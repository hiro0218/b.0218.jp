import { forwardRef, memo } from 'react';
import { Anchor } from '@/components/UI/Anchor';
import { convertPostSlugToPath } from '@/lib/url';
import { ICON_SIZE_XS } from '@/ui/icons';
import { Hashtag, MagnifyingGlass } from '@/ui/icons/index';
import { cx } from '@/ui/styled';
import type { MatchedIn } from '../../types';
import { AnchorStyle, FocusedContainerStyle, LinkContainerStyle } from './Result';

type NavigableLinkProps = {
  slug: string;
  title: string;
  isFocused: boolean;
  matchedIn: MatchedIn;
};

/**
 * 検索結果の個別リンクを表示する表示専用コンポーネント
 * キーボードナビゲーションと画面遷移ロジックはuseSearchIntegrationで中央管理
 * マッチタイプに応じてバッジを表示し、タグマッチかタイトルマッチかを視覚的に区別
 */
export const NavigableLink = memo(
  forwardRef<HTMLDivElement, NavigableLinkProps>(({ slug, title, isFocused, matchedIn }, ref) => {
    const link = convertPostSlugToPath(slug);

    return (
      <div
        className={isFocused ? cx(LinkContainerStyle, FocusedContainerStyle) : LinkContainerStyle}
        ref={ref}
        tabIndex={isFocused ? 0 : -1}
      >
        <Anchor className={AnchorStyle} href={link} prefetch={false}>
          {matchedIn === 'tag' ? (
            <Hashtag height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          ) : (
            <MagnifyingGlass height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
          )}
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </Anchor>
      </div>
    );
  }),
);

NavigableLink.displayName = 'NavigableLink';
