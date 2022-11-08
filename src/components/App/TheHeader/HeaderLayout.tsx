import { ReactNode, useEffect, useRef, useState } from 'react';

import { WaveDown } from '@/components/Functional/Wave';
import { css, styled } from '@/ui/styled';
import { theme } from '@/ui/themes';

type Props = {
  children: ReactNode;
};

export const HeaderLayout = ({ children }: Props) => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);

  useEffect(() => {
    const headerHeight = theme.components.header.height;
    let ticking = false;
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        requestAnimationFrame(() => {
          ticking = false;

          // ヘッダーの高さを超えた場合
          if (currentScrollY >= headerHeight) {
            setIsHeaderShown(currentScrollY <= lastScrollY);
          } else {
            setIsHeaderShown(true);
          }

          // 今回のスクロール位置を残す
          lastScrollY = currentScrollY;
        });
      }

      ticking = true;
    };

    document.removeEventListener('scroll', handleScroll);
    document.addEventListener('scroll', handleScroll);
  }, []);

  return (
    <Underline>
      <Header isFixed={isHeaderShown}>{children}</Header>
      <WaveDown fill="var(--component-backgrounds-3)" />
    </Underline>
  );
};

const Underline = styled.div`
  height: ${({ theme }) => theme.components.header.height}px;
`;

const Header = styled.header<{ isFixed: boolean }>`
  position: fixed;
  z-index: var(--zIndex-header);
  top: 0;
  right: 0;
  left: 0;
  height: ${({ theme }) => theme.components.header.height}px;
  margin: 0 auto;
  transition: transform 0.25s ease;
  pointer-events: none;
  will-change: transform;

  ${({ theme, isFixed }) => {
    return (
      !isFixed &&
      css`
        && {
          transform: translateY(${theme.components.header.height * -1}px);
        }
      `
    );
  }}
`;
