import type { ReactNode } from 'react';

import { styled } from '@/ui/styled';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <Root data-app-root>{children}</Root>;
};

const Root = styled.div`
  height: 100vh;

  @media (--isMobile) {
    display: grid;
    grid-template-rows: auto 1fr auto;
    row-gap: var(--spacing-3);
  }

  @media (--isDesktop) {
    display: grid;
    grid-template-rows: auto 1fr auto;
    row-gap: var(--spacing-4);
  }
`;
