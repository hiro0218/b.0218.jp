import type { AriaRole, JSX, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';
import { containerType } from '@/ui/styled/utilities';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceGap | 0;
  role?: AriaRole;
  className?: string;
  children: ReactNode;
};

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--spacing-1)), max-content));

  @container (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const Grid = ({ as: GridTag = 'div', role, children, gap, className, ...props }: Props) => {
  return (
    <GridTag role={role} {...props} className={cx(className, gridStyle, containerType)} data-gap={gap}>
      {children}
    </GridTag>
  );
};
