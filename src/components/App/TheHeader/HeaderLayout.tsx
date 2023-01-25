import { memo, ReactNode } from 'react';

import { WaveDown } from '@/components/Functional/Wave';
import { fadeIn, fadeOut } from '@/ui/animation';
import { css, styled } from '@/ui/styled';

import { useHeaderScrollHandler } from './useHeaderScrollHandler';
type Props = {
  children: ReactNode;
};

export const HeaderLayout = memo(function HeaderLayout({ children }: Props) {
  const isHeaderShown = useHeaderScrollHandler();

  return (
    <Underline>
      <Header isFixed={isHeaderShown}>{children}</Header>
      <WaveDown fill="var(--component-backgrounds-3)" />
    </Underline>
  );
});

const Underline = styled.div`
  height: ${({ theme }) => theme.components.header.height}px;
`;

const Header = styled.header<{ isFixed: boolean }>`
  position: fixed;
  z-index: var(--zIndex-header);
  isolation: isolate;
  top: 0;
  right: 0;
  left: 0;
  height: ${({ theme }) => theme.components.header.height}px;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s linear both;
  pointer-events: none;
  will-change: opacity;

  ${({ isFixed }) => {
    return (
      !isFixed &&
      css`
        && {
          animation: ${fadeOut} 0.4s linear both;
        }
      `
    );
  }}
`;
