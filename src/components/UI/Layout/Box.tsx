import type { JSX, ReactNode } from 'react';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  mt?: SpaceGap;
  className?: string;
  children?: ReactNode;
};

export const Box = ({ as: Tag = 'div', mt = undefined, className = undefined, children, ...props }: Props) => {
  return (
    <Tag {...(mt && { 'data-mt': mt })} className={className} {...props}>
      {children}
    </Tag>
  );
};
