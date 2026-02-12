import type { ReactNode } from 'react';

import { styled } from '@/ui/styled';

export const Layout = ({ children }: { children: ReactNode }) => {
  return <Root data-app-root>{children}</Root>;
};

const Root = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  row-gap: clamp(var(--spacing-3), 3.5vw, var(--spacing-4));
  height: 100vh;
`;
