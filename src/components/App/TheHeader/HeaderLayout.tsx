import { ReactNode } from 'react';

import { WaveDown } from '@/components/Functional/Wave';
import { css, styled } from '@/ui/styled';

import { useHeaderScrollHandler } from './useHeaderScrollHandler';
type Props = {
  children: ReactNode;
};

export const HeaderLayout = ({ children }: Props) => {
  const isHeaderShown = useHeaderScrollHandler();

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
