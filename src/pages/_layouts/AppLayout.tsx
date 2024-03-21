import type { ReactNode } from 'react';

import { isDesktop } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <Root>{children}</Root>;
};

const Root = styled.div`
  height: 100vh;

  ${isDesktop} {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
`;
