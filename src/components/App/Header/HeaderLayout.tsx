import { memo, type ReactNode } from 'react';

import { WaveTop } from '@/components/Functional/Wave';
import useIsMounted from '@/hooks/useIsMounted';
import { fadeIn, fadeOut } from '@/ui/animation';
import { css, styled } from '@/ui/styled';

import { useHeaderScrollHandler } from './useHeaderScrollHandler';

type Props = {
  children: ReactNode;
};

export const HeaderLayout = memo(function HeaderLayout({ children }: Props) {
  const isMounted = useIsMounted();
  const isHeaderShown = useHeaderScrollHandler();

  return (
    <Underline>
      <Header isMounted={isMounted} isShown={isHeaderShown}>
        {children}
      </Header>
      <WaveTop />
    </Underline>
  );
});

const Underline = styled.div`
  height: var(--space-5);
`;

const Header = styled.header<{ isMounted: boolean; isShown: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--zIndex-header);
  height: var(--space-5);
  margin: 0 auto;
  pointer-events: none;
  isolation: isolate;
  will-change: opacity;

  ${({ isMounted, isShown }) => {
    if (!isMounted) {
      return '';
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
