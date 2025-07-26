'use client';

import { useId } from 'react';
import { Container, Content, Trigger } from './styles';
import type { DropdownMenuProps } from './types';
import { useDropdownMenu } from './useDropdownMenu';

/**
 * クリック操作で開閉するドロップダウンメニューコンポーネント
 * メニュー外のクリックで自動的に閉じる機能を持つ
 *
 * @param {DropdownMenuProps} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ドロップダウンメニューコンポーネント
 */
export const DropdownMenu = ({ title, children, menuHorizontalPosition = 'right' }: DropdownMenuProps) => {
  const { isOpen, ref, toggleDropdownMenuContent } = useDropdownMenu();
  const id = useId();

  return (
    <Container ref={ref}>
      <Trigger
        aria-controls={id}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="link-style--hover-effect"
        onClick={toggleDropdownMenuContent}
        type="button"
      >
        {title}
      </Trigger>
      <Content aria-expanded={isOpen} data-position={menuHorizontalPosition} id={id} role="menu">
        {children}
      </Content>
    </Container>
  );
};
