import { Property } from 'csstype';
import React, { CSSProperties, memo, NamedExoticComponent } from 'react';

export interface StackProps {
  children?: React.ReactNode;
  gap?: Property.Gap;
  align?: Property.AlignContent;
  justify?: Property.JustifyContent;
  wrap?: Property.FlexWrap;
  direction?: Property.FlexDirection;
  basis?: Property.FlexBasis;
  grow?: Property.FlexGrow;
  shrink?: Property.FlexShrink;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}

export const Stack = memo(function Stack(props: StackProps) {
  const { direction, align, gap, justify, wrap, basis, grow, shrink, width, height, className, style, children } =
    props;
  const styles = {
    display: 'flex',
    flexDirection: direction,
    gap: gap,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink,
    width: width,
    height: height,
    ...style,
  };

  return (
    <div className={className} style={styles}>
      {children}
    </div>
  );
}) as NamedExoticComponent<StackProps> & {
  Item: typeof Item;
};

export const Item = memo(function Item(props: StackProps) {
  const { children } = props;

  return <Stack {...props}>{children}</Stack>;
});

Stack.Item = Item;
