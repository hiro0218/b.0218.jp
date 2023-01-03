import { memo, ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  children?: ReactNode;
};

const PageContentContainer = memo(function PageContentContainer({ children }: Props) {
  return <Container>{children}</Container>;
});

export default PageContentContainer;

const Container = styled.div`
  margin-top: var(--space-md);

  > * + * {
    margin-top: var(--space-xl);
  }
`;
