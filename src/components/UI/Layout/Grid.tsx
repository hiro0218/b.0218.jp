import type { AriaRole, ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: '½' | '1' | '2' | '3' | '4' | '5' | '6';
  role?: AriaRole;
  children: ReactNode;
};

export const Grid = memo(function Grid({ as = 'div', role, children, ...props }: Props) {
  const MemoizedGridRoot = useMemo(() => GridRoot.withComponent(as), [as]);

  return (
    <MemoizedGridRoot as={as} role={role} {...props}>
      {children}
    </MemoizedGridRoot>
  );
});

const GridRoot = styled.div<Props>`
  display: grid;
  grid-template-columns: repeat(2, minmax(calc(50% - var(--space-1)), max-content));
  gap: ${({ gap }) => {
    return gap ? `var(--space-${gap})` : undefined;
  }};

  ${isMobile} {
    grid-template-columns: minmax(100%, max-content);
    gap: ${({ gap }) => {
      return gap ? `var(--space-${gap})` : undefined;
    }};
  }
`;
