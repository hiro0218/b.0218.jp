import { ReactNode, useEffect, useRef, useState } from 'react';

import { WaveDown } from '@/components/Functional/Wave';
import { css, styled } from '@/ui/styled';
import { theme } from '@/ui/themes';

type Props = {
  children: ReactNode;
};

export const HeaderLayout = ({ children }: Props) => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          ticking = false;

          // ヘッダーの高さを超えた場合
          if (currentScrollY >= theme.components.header.height) {
            setIsHeaderShown(currentScrollY <= lastScrollY.current);
          } else {
            setIsHeaderShown(true);
          }

          // 今回のスクロール位置を残す
          lastScrollY.current = currentScrollY;
        });
      }

      ticking = true;
    };

    document.removeEventListener('scroll', handleScroll);
    return () => {
      document.addEventListener('scroll', handleScroll);
      lastScrollY.current = 0;
    };
  }, [lastScrollY]);

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
