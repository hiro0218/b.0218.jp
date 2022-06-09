import { CSSProperties, memo } from 'react';

import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  style?: CSSProperties;
  children?: React.ReactNode;
}

export const Container = memo(function Container(props: ContainerProps) {
  const { children, ...others } = props;

  return (
    <ContainerRoot className="l-container" {...others}>
      {children}
    </ContainerRoot>
  );
});

const ContainerRoot = styled.div`
  max-width: var(--container-width);
  margin: var(--space-md) auto 0;

  ${mobile} {
    padding: 0 5vw;
  }
`;
