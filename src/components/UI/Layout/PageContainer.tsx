import { type ElementType, memo, type ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  as?: ElementType;
  children?: ReactNode;
};

const PageContainer = memo(function PageContainer({ as, children }: Props) {
  return <Container as={as}>{children}</Container>;
});

export default PageContainer;

const Container = styled.div`
  margin-top: var(--space-3);

  > * + * {
    margin-top: var(--space-4);
  }
`;
