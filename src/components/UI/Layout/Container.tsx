import { memo, ReactNode } from 'react';

import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

type ContainerProps = {
  children?: ReactNode;
};

export const MainContainer = memo(function Container({ children }: ContainerProps) {
  return <ContainerRoot className="l-container">{children}</ContainerRoot>;
});

const ContainerRoot = styled.main`
  max-width: var(--container-width);
  margin: 0 auto;

  ${mobile} {
    padding: 0 5vw;
  }
`;
