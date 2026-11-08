'use client';
import { ListIcon, XIcon } from '@phosphor-icons/react';
import { useInteractOutside } from '@react-aria/interactions';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { NavigationLink } from '@/components/App/NavigationLink';
import { NAVIGATION_LINKS } from '@/components/App/navigationLinks';
import { BREAKPOINT } from '@/constants';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css, cx, styled } from '@/ui/styled';
import { stateLayerControl } from '@/ui/styled/components/stateLayerControl';

const NAVIGATION_ID = 'header-navigation';

export function HeaderNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useInteractOutside({
    ref: rootRef,
    isDisabled: !isExpanded,
    onInteractOutside: () => setIsExpanded(false),
  });

  // デスクトップ幅になった時点で state をリセットする
  // リセットしないと、モバイルで開いたままデスクトップ幅を経由してモバイル幅に戻した際、
  // 操作していないのにパネルが開いた状態で再出現する
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsExpanded(false);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // document の keydown では受けない。検索ダイアログなど他の dialog の Esc まで拾い、除外する特例が要るため
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isExpanded || event.key !== 'Escape') return;

    setIsExpanded(false);
    toggleButtonRef.current?.focus();
  };

  // フォーカスをクリックの移動に任せない。macOS の Safari・Firefox はクリックでボタンにフォーカスが当たらず、Esc をこの要素の中で受けられなくなるため
  const handleToggleClick = () => {
    if (!isExpanded) toggleButtonRef.current?.focus();
    setIsExpanded((current) => !current);
  };

  const ToggleIcon = isExpanded ? XIcon : ListIcon;

  return (
    <Root onKeyDown={handleKeyDown} ref={rootRef}>
      <button
        aria-controls={NAVIGATION_ID}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'ナビゲーションを閉じる' : 'ナビゲーションを開く'}
        className={cx(stateLayerControl, toggleStyle)}
        onClick={handleToggleClick}
        ref={toggleButtonRef}
        type="button"
      >
        <ToggleIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </button>
      <Nav aria-label="ヘッダー" data-expanded={isExpanded} id={NAVIGATION_ID}>
        {NAVIGATION_LINKS.map(({ title, href }) => (
          <NavigationLink href={href} key={href} onClick={() => setIsExpanded(false)}>
            {title}
          </NavigationLink>
        ))}
      </Nav>
    </Root>
  );
}

const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const toggleStyle = css`
  @media (--isDesktop) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: none;

  /* 開いたナビは、枠線や影を使わず、面（gray-75）で本文と区別する */
  @media not all and (--isDesktop) {
    &[data-expanded='true'] {
      position: absolute;
      top: calc(100% + var(--spacing-200));
      right: 0;
      z-index: var(--z-index-base);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-75);
      min-width: 160px;

      /* ページをスクロールして、ヘッダーごとパネルを隠す形にしない。開いたまま下の項目を選べず、隠れると閉じる操作もできないため。
         パネルの端でページへスクロールを連鎖させない（overscroll-behavior）。連鎖するとヘッダーが隠れ、パネルごと消えるため */
      max-height: calc(100dvh - var(--sizes-header) - var(--spacing-200));
      padding: var(--spacing-100);
      overflow-y: auto;
      overscroll-behavior: contain;
      background-color: var(--colors-gray-75);
      border-radius: var(--radii-md);

      > a {
        justify-content: flex-start;
      }
    }
  }

  @media (--isDesktop) {
    display: inline-flex;
    gap: var(--spacing-100);
    align-items: center;
  }
`;
