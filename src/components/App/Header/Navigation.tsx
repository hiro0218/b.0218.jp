'use client';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useInteractOutside } from '@react-aria/interactions';
import { useEffect, useRef, useState } from 'react';
import { NAVIGATION_LINKS } from '@/components/App/navigationLinks';
import { Anchor } from '@/components/UI/Anchor';
import { IconButton } from '@/components/UI/IconButton';
import { BREAKPOINT } from '@/constants';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { css, styled } from '@/ui/styled';

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

  // モバイルの展開中のみ Esc キーで閉じる（デスクトップは上記の useEffect で state ごと閉じるため不要）
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // 検索ダイアログなど他の <dialog> 内で発生した Esc はそちら側の close に委ね、背後のナビまで閉じない
      if ((event.target as HTMLElement | null)?.closest('dialog[open]')) return;

      setIsExpanded(false);
      toggleButtonRef.current?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const ToggleIcon = isExpanded ? XMarkIcon : Bars3Icon;

  return (
    <Root ref={rootRef}>
      <IconButton
        aria-controls={NAVIGATION_ID}
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'ナビゲーションを閉じる' : 'ナビゲーションを開く'}
        className={toggleStyle}
        data-active={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
        ref={toggleButtonRef}
        size="touch"
      >
        <ToggleIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      </IconButton>
      <Nav aria-label="ヘッダー" data-expanded={isExpanded} id={NAVIGATION_ID}>
        {NAVIGATION_LINKS.map(({ title, href }) => (
          <Anchor
            className="link-style link-style--hover-effect"
            href={href}
            key={href}
            onClick={() => setIsExpanded(false)}
          >
            {title}
          </Anchor>
        ))}
      </Nav>
    </Root>
  );
}

const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  pointer-events: auto;
`;

const toggleStyle = css`
  @media (--isDesktop) {
    display: none;
  }
`;

const Nav = styled.nav`
  display: none;

  @media not all and (--isDesktop) {
    &[data-expanded='true'] {
      position: absolute;
      top: calc(100% + var(--spacing-200));
      right: 0;
      z-index: var(--z-index-base);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-100);
      min-width: 160px;
      padding: var(--spacing-200);
      background-color: var(--colors-body-background);
      border: var(--border-widths-thin) solid var(--colors-gray-200);
      border-radius: var(--radii-md);
    }
  }

  @media (--isDesktop) {
    display: inline-flex;
    gap: var(--spacing-400);
    align-items: center;
    font-family: var(--fonts-family-monospace);
    font-size: var(--font-sizes-sm);
  }
`;
