import styled from '@emotion/styled';
import React, { CSSProperties, memo } from 'react';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  style?: CSSProperties;
  children?: React.ReactNode;
}

const Root = styled.div<ContainerProps>`
  max-width: 85ch;
  margin: var(--margin-base) auto 0;

  @media (max-width: 959px) {
    padding: 0 5vw;
  }
`;

export const Container = memo(function Container(props: ContainerProps) {
  const { children, ...others } = props;

  return (
    <Root className="l-container" {...others}>
      {children}
    </Root>
  );
});
