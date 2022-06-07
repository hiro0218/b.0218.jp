import { CSSProperties, memo, NamedExoticComponent, ReactNode } from 'react';

import { styled } from '@/ui/styled';

type divProps = JSX.IntrinsicElements['div'];
export interface FlexProps extends divProps {
  display?: CSSProperties['display'];
  gap?: CSSProperties['columnGap'];
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  direction?: CSSProperties['flexDirection'];
  basis?: CSSProperties['flexBasis'];
  grow?: CSSProperties['flexGrow'];
  shrink?: CSSProperties['flexShrink'];
  style?: CSSProperties;
  children?: ReactNode;
}

const Root = styled.div<FlexProps>`
  /* stylelint-disable indentation */
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

export const Flex = memo(function Flex(props: FlexProps) {
  const { children, ...others } = props;

  return (
    <Root className="l-flex" {...others}>
      {children}
    </Root>
  );
}) as NamedExoticComponent<FlexProps> & {
  Item: typeof Item;
};

export const Item = memo(function Item(props: FlexProps) {
  const { children, ...others } = props;

  return (
    <Flex className="l-flex__item" {...others}>
      {children}
    </Flex>
  );
});

Flex.Item = Item;
