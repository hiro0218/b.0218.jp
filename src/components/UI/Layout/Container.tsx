import { memo, ReactNode } from 'react';

import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  children?: ReactNode;
};

const MainContainer = memo(function Container({ children }: Props) {
  return <ContainerRoot>{children}</ContainerRoot>;
});

export default MainContainer;

const ContainerRoot = styled.main`
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;

  ${isMobile} {
    padding: 0 5vw;
  }
`;
