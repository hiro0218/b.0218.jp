'use client';

import type { ReactNode } from 'react';
import { useId } from 'react';
import { styled } from '@/ui/styled';
import { useDropdownMenu } from './useDropdownMenu';

export type DropdownMenuProps = {
  title: ReactNode;
  children: ReactNode;
  menuHorizontalPosition?: 'left' | 'right';
};

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
      background-color: var(--colors-gray-a-4);
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
  border: 1px solid var(--colors-gray-a-4);
  border-radius: var(--radii-4);
  box-shadow: var(--shadows-md);
  opacity: 0;
  transform: scale(0.8);
  transition: transform 0.1s linear;

  &[data-position='left'] {
    left: 0;
  }

  &[data-position='right'] {
    right: 0;
  }

  &[aria-expanded='true'] {
    content-visibility: visible;
    opacity: 1;
    transform: scale(1);

    @starting-style {
      opacity: 0;
    }
  }

  & > a {
    padding: var(--spacing-½) var(--spacing-1);
    line-height: var(--line-heights-lg);
    border-radius: var(--radii-4);
  }
`;
