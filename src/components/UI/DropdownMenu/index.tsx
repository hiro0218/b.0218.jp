'use client';

import type { ReactNode, RefObject } from 'react';
import { Children, isValidElement, useId, useMemo, useRef } from 'react';
import { useButton, useInteractOutside, useMenu, useMenuItem } from 'react-aria';
import type { Node } from 'react-stately';
import { Item, useMenuTriggerState, useTreeState } from 'react-stately';
import { styled } from '@/ui/styled';

type MenuPosition = 'left' | 'right';

export type DropdownMenuProps = {
  title: ReactNode;
  children: ReactNode;
  menuHorizontalPosition?: MenuPosition;
};

/**
 * クリック操作で開閉するドロップダウンメニューコンポーネント
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

type MenuPopoverProps = {
  children: ReactNode;
  onClose: () => void;
  autoFocus?: boolean | 'first' | 'last';
  menuRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  'data-position': MenuPosition;
  'aria-labelledby': string;
};

/**
 * ReactNodeからテキストコンテンツを再帰的に抽出
 * React AriaのtextValue要求を満たすために使用（スクリーンリーダー対応）
 */
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  if (isValidElement(node)) {
    const { children } = node.props as { children?: ReactNode };
    return children ? extractTextContent(children) : '';
  }
  return '';
}

function MenuPopover({
  children,
  onClose,
  autoFocus,
  menuRef,
  isOpen,
  'data-position': dataPosition,
  'aria-labelledby': ariaLabelledby,
}: MenuPopoverProps) {
  // 子要素を React Stately の Item にラップ（childrenが変更時のみ再計算）
  const menuItems = useMemo(() => {
    return Children.toArray(children).map((child, index) => {
      const textValue = extractTextContent(child);
      // 既存のkeyを優先、なければtextValueとindexから生成
      const itemKey = isValidElement(child) && child.key ? child.key : `menu-item-${textValue}-${index}`;
      return (
        <Item key={itemKey} textValue={textValue}>
          {child}
        </Item>
      );
    });
  }, [children]);

  // メニュー選択を無効化（ナビゲーション目的のためselectionMode: 'none'）
  const state = useTreeState({ selectionMode: 'none', children: menuItems });

  const { menuProps } = useMenu({ autoFocus, onClose, 'aria-labelledby': ariaLabelledby }, state, menuRef);

  return (
    <Content {...menuProps} aria-expanded={isOpen} data-position={dataPosition} ref={menuRef} role="menu">
      {Array.from(state.collection).map((item) => (
        <MenuItem item={item} key={item.key} onAction={onClose} state={state} />
      ))}
    </Content>
  );
}

type MenuItemProps = {
  item: Node<object>;
  state: ReturnType<typeof useTreeState>;
  onAction: () => void;
};

function MenuItem({ item, state, onAction }: MenuItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { menuItemProps } = useMenuItem(
    {
      key: item.key,
      onAction,
    },
    state,
    ref,
  );

  return (
    <MenuItemWrapper {...menuItemProps} ref={ref}>
      {item.rendered}
    </MenuItemWrapper>
  );
}

export const Container = styled.div`
  position: relative;
  display: flex;
`;

export const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--sizes-icon-sm) * 2);
  height: calc(var(--sizes-icon-sm) * 2);

  &:has(+ [aria-expanded='true']) {
    &::after {
      background-color: var(--colors-gray-a-200);
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const Content = styled.div`
  position: absolute;
  top: 100%;
  z-index: var(--z-index-base);
  min-width: max-content;
  height: fit-content;
  padding: var(--spacing-½);
  content-visibility: hidden;
  background-color: var(--colors-white);
  border: 1px solid var(--colors-gray-a-200);
  border-radius: var(--radii-4);
  box-shadow: var(--shadows-md);
  opacity: 0;
  transform: scale(0.8);
  transition: transform 0.1s linear;

  &[data-position='left'] {
    left: 0;
    transform-origin: top left;
  }

  &[data-position='right'] {
    right: 0;
    transform-origin: top right;
  }

  &[aria-expanded='true'] {
    content-visibility: visible;
    opacity: 1;
    transform: scale(1);

    @starting-style {
      opacity: 0;
    }
  }
`;

export const MenuItemWrapper = styled.div`
  & > a {
    display: flex;
    align-items: center;
    padding: var(--spacing-½) var(--spacing-1);
    line-height: var(--line-heights-lg);
    border-radius: var(--radii-4);
  }
`;
