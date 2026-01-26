import type { ReactNode } from 'react';

import { styled } from '@/ui/styled';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <Root data-app-root>{children}</Root>;
};

const Root = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;

  @media (--isMobile) {
    row-gap: var(--spacing-3);
  }

  @media (--isDesktop) {
    row-gap: var(--spacing-4);
  }
`;
