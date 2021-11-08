import styled from '@emotion/styled';
import { Property } from 'csstype';
import React, { CSSProperties, memo, NamedExoticComponent } from 'react';

type divProps = JSX.IntrinsicElements['div'];
export interface StackProps extends divProps {
  display?: Property.Display;
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
  display: ${({ display }) => {
    switch (display) {
      case '':
      case undefined:
        return 'flex';
      case 'block':
        return '';
      default:
        return display;
    }
  }};
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

  return (
    <Stack className="l-stack__item" {...others}>
      {children}
    </Stack>
  );
});

Stack.Item = Item;
