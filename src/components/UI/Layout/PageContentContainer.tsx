import { memo } from 'react';

import { styled } from '@/ui/styled';

export interface ContainerProps {
  children?: React.ReactNode;
}

export const PageContentContainer = memo(function PageContentContainer({ children }: ContainerProps) {
  return <Container>{children}</Container>;
});

const Container = styled.div`
  margin-top: var(--space-md);

  > * + * {
    margin-top: var(--space-xl);
  }
`;
