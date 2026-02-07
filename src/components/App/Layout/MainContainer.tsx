import type { ReactNode } from 'react';

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main id="main" tabIndex={-1}>
      {children}
    </main>
  );
};
