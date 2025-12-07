'use client';

import type { ReactNode } from 'react';
import { Children, isValidElement, useId, useMemo, useRef } from 'react';
import { useButton, useInteractOutside, useMenu, useMenuItem } from 'react-aria';
import type { Node } from 'react-stately';
import { Item, useMenuTriggerState, useTreeState } from 'react-stately';
import { styled } from '@/ui/styled';

export type DropdownMenuProps = {
  title: ReactNode;
  children: ReactNode;
  menuHorizontalPosition?: 'left' | 'right';
};

/**
 * クリック操作で開閉するドロップダウンメニューコンポーネント
 * React Aria を使用してアクセシビリティを向上
 *
 * @param {DropdownMenuProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ドロップダウンメニューコンポーネント
 */
export const DropdownMenu = ({ title, children, menuHorizontalPosition = 'right' }: DropdownMenuProps) => {
  const state = useMenuTriggerState({});
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();

  const { buttonProps } = useButton(
    {
      onPress: () => state.toggle(),
    },
    triggerRef,
  );

  // 外側クリックでメニューを閉じる
  useInteractOutside({
    ref: containerRef,
    onInteractOutside: () => {
      if (state.isOpen) {
        state.close();
      }
    },
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
};

type MenuPopoverProps = {
  children: ReactNode;
  onClose: () => void;
  autoFocus?: boolean | 'first' | 'last';
  menuRef: React.RefObject<HTMLDivElement>;
  isOpen: boolean;
  'data-position'?: 'left' | 'right';
  'aria-labelledby': string;
};

/**
 * ReactNode からテキストコンテンツを抽出する
 * アクセシビリティのための textValue を生成するために使用
 */
function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props.children) {
      return extractTextContent(props.children);
    }
  }

  return '';
}

function MenuPopover({
  children,
  onClose,
  autoFocus,
  menuRef,
  isOpen,
  'data-position': position,
  'aria-labelledby': ariaLabelledby,
}: MenuPopoverProps) {
  // Fragment を含む子要素を適切にフラット化
  const items = Children.toArray(children);

  // テキスト抽出をメモ化してパフォーマンスを向上
  const textValues = useMemo(() => items.map((child) => extractTextContent(child)), [items]);

  const state = useTreeState({
    selectionMode: 'none',
    children: items.map((child, index) => {
      const textValue = textValues[index];
      // 既存の key を使用、なければ安定した ID を生成
      const itemKey = isValidElement(child) && child.key ? child.key : `menu-item-${textValue}-${index}`;

      return (
        <Item key={itemKey} textValue={textValue}>
          {child}
        </Item>
      );
    }),
  });

  const { menuProps: ariaMenuProps } = useMenu(
    {
      autoFocus,
      onClose,
      'aria-labelledby': ariaLabelledby,
    },
    state,
    menuRef,
  );

  return (
    <Content {...ariaMenuProps} aria-expanded={isOpen} data-position={position} ref={menuRef} role="menu">
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
