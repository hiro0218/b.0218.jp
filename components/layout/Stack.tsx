import { Property } from 'csstype';
import { styled } from 'linaria/react';
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
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

const Root = styled.div<StackProps>`
  display: flex;
  gap: ${(props) => props.gap || ''};
  flex-direction: ${(props) => props.direction || ''};
  align-items: ${(props) => props.align || ''};
  justify-content: ${(props) => props.justify || ''};
  flex-wrap: ${(props) => props.wrap || ''};
  flex-basis: ${(props) => props.basis || ''};
  flex-grow: ${(props) => props.grow || ''};
  flex-shrink: ${(props) => props.shrink || ''};
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
