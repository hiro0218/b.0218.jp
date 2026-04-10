'use client';

import { useButton } from '@react-aria/button';
import { useInteractOutside } from '@react-aria/interactions';
import type { ReactNode } from 'react';
import { useId, useRef } from 'react';
import { useMenuTriggerState } from 'react-stately';

import { MenuPopover } from './MenuPopover';
import { Container, Trigger } from './styles';

type MenuPosition = 'left' | 'right';

export type DropdownMenuProps = {
  /** メニュートリガーに表示するコンテンツ */
  title: ReactNode;
  /** メニュー内のリンク要素 */
  children: ReactNode;
  menuHorizontalPosition?: MenuPosition;
};

/**
 * クリック操作で開閉するドロップダウンメニュー。
 * React Aria でアクセシビリティ対応済み。
 * @summary クリック開閉ドロップダウンメニュー
 */
export function DropdownMenu({ title, children, menuHorizontalPosition = 'right' }: DropdownMenuProps) {
  const state = useMenuTriggerState({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();

  const { buttonProps } = useButton({ onPress: () => state.toggle() }, triggerRef);

  // メニュー外クリックで閉じる（開いている場合のみハンドラを設定）
  useInteractOutside({
    ref: containerRef,
    onInteractOutside: state.isOpen ? () => state.close() : undefined,
  });

  return (
    <Container ref={containerRef}>
      <Trigger
        {...buttonProps}
        aria-expanded={state.isOpen}
        aria-haspopup="menu"
        className="link-style--hover-effect"
        id={triggerId}
        ref={triggerRef}
      >
        {title}
      </Trigger>
      <MenuPopover
        aria-labelledby={triggerId}
        autoFocus={state.focusStrategy}
        data-position={menuHorizontalPosition}
        isOpen={state.isOpen}
        menuRef={menuRef}
        onClose={state.close}
      >
        {children}
      </MenuPopover>
    </Container>
  );
}
