import type { AriaRole, ReactNode } from 'react';
import { type ElementType, memo } from 'react';

import { css, styled } from '@/ui/styled/dynamic';
import type { SpaceGap } from '@/ui/styled/variables/space';

type Props = {
  as?: ElementType;
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
  return (
    <_Cluster as={as} {...props}>
      {children}
    </_Cluster>
  );
});
