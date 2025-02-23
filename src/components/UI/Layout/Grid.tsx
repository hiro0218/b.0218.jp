import { css, cx } from '@/ui/styled/static';
import type { SpaceGap } from '@/ui/styled/variables/space';
import { SPACE_KEYS } from '@/ui/styled/variables/space';
import type { AriaRole, CSSProperties, JSX, ReactNode } from 'react';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceGap | 0;
  role?: AriaRole;
  className?: string;
  children: ReactNode;
};

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-1)), max-content));
  gap: var(--grid-gap);

  @media (--isMobile) {
    grid-template-columns: minmax(100%, max-content);
  }
`;

export const Grid = ({ as: GridTag = 'div', role, children, gap, className, ...props }: Props) => {
  const spaceGap = SPACE_KEYS.includes(`--space-${gap}`) ? `var(--space-${gap})` : gap === 0 ? null : `var(--space-1)`;

  return (
    <GridTag
      role={role}
      {...props}
      className={cx(className, gridStyle)}
      style={
        {
          '--grid-gap': spaceGap,
        } as CSSProperties
      }
    >
      {children}
    </GridTag>
  );
};
