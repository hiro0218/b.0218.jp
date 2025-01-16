import type { ReactNode } from 'react';

import { styled } from '@/ui/styled/static';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <Root>{children}</Root>;
};

const Root = styled.div`
  height: 100vh;

  @media (--isDesktop) {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
`;
