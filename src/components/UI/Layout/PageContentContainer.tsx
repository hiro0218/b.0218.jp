import { CSSProperties, memo } from 'react';

import { styled } from '@/ui/styled';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  style?: CSSProperties;
  children?: React.ReactNode;
}

export const PageContentContainer = memo(function PageContentContainer(props: ContainerProps) {
  const { children, ...others } = props;

  return (
    <Container className="l-page-content-container" {...others}>
      {children}
    </Container>
  );
});

const Container = styled.div`
  margin-top: var(--space-md);

  > * + * {
    margin-top: var(--space-xl);
  }
`;
