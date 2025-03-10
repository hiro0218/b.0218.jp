import type { SpaceGap } from '@/ui/styled/variables/space';
import type { JSX, ReactNode } from 'react';

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
