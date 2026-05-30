'use client';

import { useButton } from '@react-aria/button';
import { useInteractOutside } from '@react-aria/interactions';
import type { ReactNode } from 'react';
import { useId, useRef } from 'react';
import { useMenuTriggerState } from 'react-stately';

import { IconButton } from '@/components/UI/IconButton';

import { Popover } from './DropdownMenu/Popover';
import { Container } from './DropdownMenu/styles';

type MenuPosition = 'left' | 'right';

export type DropdownMenuProps = {
  /** メニュートリガーに表示するコンテンツ（アイコン等） */
  title: ReactNode;
  /** トリガーの aria-label。アイコン主体のトリガーで操作意図を読み上げできるよう必須にする */
  triggerLabel: string;
  /** メニュー内のリンク要素 */
  children: ReactNode;
  menuHorizontalPosition?: MenuPosition;
};

/**
 * クリック操作で開閉するドロップダウンメニュー。
 * React Aria でアクセシビリティ対応済み。
 * @summary クリック開閉ドロップダウンメニュー
 */
export function DropdownMenu({ title, triggerLabel, children, menuHorizontalPosition = 'right' }: DropdownMenuProps) {
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
      <IconButton
        {...buttonProps}
        aria-expanded={state.isOpen}
        aria-haspopup="menu"
        aria-label={triggerLabel}
        data-active={state.isOpen}
        id={triggerId}
        ref={triggerRef}
      >
        {title}
      </IconButton>
      <Popover
        aria-labelledby={triggerId}
        autoFocus={state.focusStrategy}
        data-position={menuHorizontalPosition}
        isOpen={state.isOpen}
        menuRef={menuRef}
        onClose={state.close}
      >
        {children}
      </Popover>
    </Container>
  );
}
