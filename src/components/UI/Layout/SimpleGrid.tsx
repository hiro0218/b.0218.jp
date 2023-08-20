import type { AriaRole, CSSProperties, ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { css, styled } from '@/ui/styled';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: '½' | '1' | '2' | '3' | '4' | '5' | '6';
  wrap?: CSSProperties['flexWrap'];
  role?: AriaRole;
  isWide?: boolean;
  children: ReactNode;
};

const GridRoot = styled.div<Props>`
  display: flex;
  flex-wrap: ${({ wrap = 'wrap' }) => wrap};
  gap: ${({ gap = '1' }) => `var(--space-${gap})`};

  ${({ isWide = true }) => {
    return (
      isWide &&
      css`
        align-content: start;
        & > * {
          flex: 1 1 auto;
        }
      `
    );
  }};
`;

const SimpleGrid = memo(function Grid({ as = 'div', children, ...props }: Props) {
  const MemoizedGridRoot = useMemo(() => GridRoot.withComponent(as), [as]);

  return (
    <MemoizedGridRoot as={as} {...props}>
      {children}
    </MemoizedGridRoot>
  );
});

export default SimpleGrid;
