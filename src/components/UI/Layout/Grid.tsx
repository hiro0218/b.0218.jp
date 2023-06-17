// Every Layout の Grid に基づいたコンポーネントを作成する

import type { AriaRole, ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: '½' | '1' | '2' | '3' | '4' | '5' | '6';
  role?: AriaRole;
  children: ReactNode;
};

const GridRoot = styled.div<Props>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ gap = '1' }) => `var(--space-${gap})`};
  align-content: start;

  & > * {
    flex: 1 1 auto;
  }
`;

const Grid = memo(function Grid({ as = 'div', children, ...props }: Props) {
  const MemoizedStackRoot = useMemo(() => GridRoot.withComponent(as), [as]);

  return (
    <MemoizedStackRoot as={as} {...props}>
      {children}
    </MemoizedStackRoot>
  );
});

export default Grid;
