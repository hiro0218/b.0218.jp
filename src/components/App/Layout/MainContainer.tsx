import type { ReactNode } from 'react';
import { MAIN_CONTENT_ID } from '@/constants';
import { styled } from '@/ui/styled';

export const MainContainer = ({ children }: { children: ReactNode }) => {
  return (
    <Main id={MAIN_CONTENT_ID} tabIndex={-1}>
      {children}
    </Main>
  );
};

const Main = styled.main`
  min-inline-size: 0;
`;
