import type { ReactNode } from 'react';
import { MAIN_CONTENT_ID } from '@/constants';

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1}>
      {children}
    </main>
  );
};
