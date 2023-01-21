import { memo, ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  children?: ReactNode;
};

const PageContainer = memo(function PageContainer({ children }: Props) {
  return <Container>{children}</Container>;
});

export default PageContainer;

const Container = styled.div`
  margin-top: var(--space-md);

  > * + * {
    margin-top: var(--space-xl);
  }
`;
