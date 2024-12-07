import type { AriaRole, ReactNode } from 'react';
import { type ElementType, memo } from 'react';

import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/CssBaseline/Settings/Space';
import { SPACE_KEYS } from '@/ui/styled/CssBaseline/Settings/Space';

type Props = {
  as?: ElementType;
  gap?: SpaceGap | 0;
  role?: AriaRole;
  children: ReactNode;
};

export const Grid = memo(function Grid({ as = 'div', role, children, gap, ...props }: Props) {
  const spaceGap = SPACE_KEYS.includes(`--space-${gap}`) ? gap : gap === 0 ? null : 1;

  return (
    <GridRoot as={as} gap={spaceGap} role={role} {...props}>
      {children}
    </GridRoot>
  );
});

const GridRoot = styled.div<Props>`
  container-type: inline-size;
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-1)), max-content));
  gap: ${({ gap = 1 }) => gap && `var(--space-${gap})`};

  ${isMobile} {
    grid-template-columns: minmax(100%, max-content);
    gap: ${({ gap = 1 }) => gap && `var(--space-${gap})`};
  }
`;
