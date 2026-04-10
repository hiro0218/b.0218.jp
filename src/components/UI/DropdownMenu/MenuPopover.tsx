'use client';

import { useMenu, useMenuItem } from '@react-aria/menu';
import type { ReactNode, RefObject } from 'react';
import { Children, isValidElement, useMemo, useRef } from 'react';
import type { Node } from 'react-stately';
import { Item, useTreeState } from 'react-stately';

import { Content, MenuItemContainer } from './styles';

type MenuPosition = 'left' | 'right';

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
 * ReactNodeからテキストコンテンツを再帰的に抽出。
 * React Aria の textValue 要求を満たすために使用（スクリーンリーダー対応）
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

export function MenuPopover({
  children,
  onClose,
  autoFocus,
  menuRef,
  isOpen,
  'data-position': dataPosition,
  'aria-labelledby': ariaLabelledby,
}: MenuPopoverProps) {
  const menuItems = useMemo(() => {
    return Children.toArray(children).map((child, index) => {
      const textValue = extractTextContent(child);
      const itemKey = isValidElement(child) && child.key ? child.key : `menu-item-${textValue}-${index}`;
      return (
        <Item key={itemKey} textValue={textValue}>
          {child}
        </Item>
      );
    });
  }, [children]);

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
    <MenuItemContainer {...menuItemProps} ref={ref}>
      {item.rendered}
    </MenuItemContainer>
  );
}
