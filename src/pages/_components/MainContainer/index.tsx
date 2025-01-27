import { css } from '@/ui/styled/static';
import type { ReactNode } from 'react';

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className={css`
        margin-top: var(--space-3);
      `}
    >
      {children}
    </main>
  );
};
