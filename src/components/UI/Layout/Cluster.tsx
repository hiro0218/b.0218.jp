import type { AriaRole, ReactNode } from 'react';
import { memo, useMemo } from 'react';

import type { SpaceGap } from '@/ui/styled/CssBaseline/Settings/Space';
import { css, styled } from '@/ui/styled/dynamic';

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

export const Cluster = memo(function Grid({ as = 'div', children, ...props }: Props) {
  const MemoizedCluster = useMemo(() => _Cluster.withComponent(as), [as]);

  return (
    <MemoizedCluster as={as} {...props}>
      {children}
    </MemoizedCluster>
  );
});
