import type { ReactNode } from 'react';

import { styled } from '@/ui/styled';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <Root data-app-root>{children}</Root>;
};

const Root = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;

  @media (--isMobile) {
    row-gap: var(--spacing-3);
  }

  @media (--isDesktop) {
    row-gap: var(--spacing-4);
  }
`;
