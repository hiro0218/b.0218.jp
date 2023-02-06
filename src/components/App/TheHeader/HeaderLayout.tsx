import { memo, ReactNode } from 'react';

import { WaveTop } from '@/components/Functional/Wave';
import useIsMounted from '@/hooks/useIsMounted';
import { fadeIn, fadeOut } from '@/ui/animation';
import { css, styled, useTheme } from '@/ui/styled';

import { useHeaderScrollHandler } from './useHeaderScrollHandler';

type Props = {
  children: ReactNode;
};

export const HeaderLayout = memo(function HeaderLayout({ children }: Props) {
  const isMounted = useIsMounted();
  const isHeaderShown = useHeaderScrollHandler();
  const theme = useTheme();

  return (
    <Underline UnderlineHeight={theme.components.header.height}>
      <Header isMounted={isMounted} isShown={isHeaderShown}>
        {children}
      </Header>
      <WaveTop />
    </Underline>
  );
});

const Underline = styled.div<{ UnderlineHeight: number }>`
  height: ${({ UnderlineHeight }) => UnderlineHeight}px;
`;

const Header = styled.header<{ isMounted: boolean; isShown: boolean }>`
  position: fixed;
  z-index: var(--zIndex-header);
  isolation: isolate;
  top: 0;
  right: 0;
  left: 0;
  height: ${({ theme }) => theme.components.header.height}px;
  margin: 0 auto;
  pointer-events: none;
  will-change: opacity;

  ${({ isMounted, isShown }) => {
    if (!isMounted) {
      return;
    }

    return isShown
      ? css`
          animation: ${fadeIn} 0.4s linear both;
        `
      : css`
          animation: ${fadeOut} 0.4s linear both;
        `;
  }}
`;
