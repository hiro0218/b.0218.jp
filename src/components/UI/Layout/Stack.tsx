import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { cx } from '@/ui/styled';
import type { FlexAlign, FlexJustify, FlexWrap } from '@/ui/styled/atomic';
import { alignClasses, directionClasses, flexBaseStyle, justifyClasses, wrapClasses } from '@/ui/styled/atomic';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props<T extends ElementType = 'div'> = {
  as?: T;
  gap?: SpaceGap | 0;
  direction?: 'vertical' | 'horizontal';
  align?: FlexAlign;
  justify?: FlexJustify;
  wrap?: FlexWrap;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'gap' | 'direction' | 'align' | 'justify' | 'wrap'>;

export const Stack = <T extends ElementType = 'div'>({
  as,
  children,
  direction = 'vertical',
  gap = 2,
  align,
  justify,
  wrap,
  className,
  ...props
}: Props<T>) => {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag
      className={cx(
        className,
        flexBaseStyle,
        directionClasses[direction],
        align && alignClasses[align],
        justify && justifyClasses[justify],
        wrap && wrapClasses[wrap],
      )}
      {...(gap !== undefined && { 'data-gap': gap })}
      {...props}
    >
      {children}
    </Tag>
  );
};
