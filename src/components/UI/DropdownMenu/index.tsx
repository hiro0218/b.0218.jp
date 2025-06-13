'use client';

import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { styled } from '@/ui/styled/static';

type Props = {
  title: ReactNode;
  children: ReactNode;
  menuHorizontalPosition?: 'left' | 'right';
};

/**
 * クリック操作で開閉するドロップダウンメニューコンポーネント
 * メニュー外のクリックで自動的に閉じる機能を持つ
 *
 * @param {Props} props - コンポーネントのプロパティ
 * @returns {JSX.Element} ドロップダウンメニューコンポーネント
 */
export const DropdownMenu = ({ title, children, menuHorizontalPosition = 'right' }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  // メニューの開閉を切り替える関数
  const toggleDropdownMenuContent = () => {
    setIsOpen((prev) => !prev);
  };

  // 外部クリックイベントのセットアップ
  useEffect(() => {
    // メニュー外のクリックを検知して閉じる関数
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

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

/**
 * ドロップダウンメニューのコンテナ要素
 * 相対位置を指定し、メニューの位置の基準点となる
 */
const Container = styled.div`
  position: relative;
  display: flex;
`;

/**
 * ドロップダウンメニューのトリガーボタン
 * クリックするとメニューが開閉する
 */
const Trigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--icon-size-sm) * 2);
  height: calc(var(--icon-size-sm) * 2);

  &:has(+ [aria-expanded='true']) {
    &::after {
      background-color: var(--color-gray-4A);
      opacity: 1;
      transform: scale(1);
    }
  }
`;

/**
 * ドロップダウンメニューのコンテンツ部分
 * aria-expanded属性によって表示/非表示が切り替わる
 */
const Content = styled.div`
  position: absolute;
  top: 100%;
  z-index: var(--zIndex-base);
  min-width: max-content;
  height: fit-content;
  padding: var(--space-½);
  content-visibility: hidden;
  background-color: var(--white);
  border: 1px solid var(--color-gray-4A);
  border-radius: var(--border-radius-4);
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
    padding: var(--space-½) var(--space-1);
    line-height: var(--line-height-lg);
    border-radius: var(--border-radius-4);
  }
`;
