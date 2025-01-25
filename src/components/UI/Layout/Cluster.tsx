import type { AriaRole, ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { styled } from '@/ui/styled/dynamic';
import type { SpaceGap } from '@/ui/styled/variables/space';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceGap;
  role?: AriaRole;
  isWide?: boolean;
  children: ReactNode;
};

const _Cluster = styled.div<Props>`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ gap = '1' }) => `var(--space-${gap})`};
  justify-content: flex-start;

  &[data-is-wide='true'] {
    align-content: start;
    & > * {
      flex: 1 1 auto;
    }
  }
`;

export const Cluster = memo(function Grid({ as = 'div', children, isWide, ...props }: Props) {
  const MemoizedCluster = useMemo(() => _Cluster.withComponent(as), [as]);

  return (
    <MemoizedCluster data-is-wide={isWide} as={as} {...props}>
      {children}
    </MemoizedCluster>
  );
});
