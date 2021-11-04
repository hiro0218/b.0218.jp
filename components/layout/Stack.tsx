import styled from '@emotion/styled';
import { Property } from 'csstype';
import React, { CSSProperties, memo, NamedExoticComponent } from 'react';

export interface StackProps {
  gap?: Property.Gap;
  align?: Property.AlignContent;
  justify?: Property.JustifyContent;
  wrap?: Property.FlexWrap;
  direction?: Property.FlexDirection;
  basis?: Property.FlexBasis;
  grow?: Property.FlexGrow;
  shrink?: Property.FlexShrink;
  style?: CSSProperties;
  children?: React.ReactNode;
}

const Root = styled.div<StackProps>`
  display: flex;
  flex-basis: ${({ basis }) => basis || ''};
  flex-direction: ${({ direction }) => direction || ''};
  flex-grow: ${({ grow }) => grow || ''};
  flex-shrink: ${({ shrink }) => shrink || ''};
  flex-wrap: ${({ wrap }) => wrap || ''};
  align-items: ${({ align }) => align || ''};
  justify-content: ${({ justify }) => justify || ''};
  gap: ${({ gap }) => gap || ''};
`;

export const Stack = memo(function Stack(props: StackProps) {
  const { children, ...others } = props;

  return (
    <Root className="l-stack" {...others}>
      {children}
    </Root>
  );
}) as NamedExoticComponent<StackProps> & {
  Item: typeof Item;
};

export const Item = memo(function Item(props: StackProps) {
  const { children, ...others } = props;

  return <Stack {...others}>{children}</Stack>;
});

Stack.Item = Item;
