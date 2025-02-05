import type { AriaRole, ReactNode } from 'react';
import { memo } from 'react';

import { css, cx } from '@/ui/styled/static';
import type { SpaceGap } from '@/ui/styled/variables/space';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceGap;
  role?: AriaRole;
  isWide?: boolean;
  className?: string;
  children: ReactNode;
};

const clusterStyle = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--cluster-space, --space-1);
  justify-content: flex-start;

  &[data-is-wide='true'] {
    align-content: start;
    & > * {
      flex: 1 1 auto;
    }
  }
`;

export const Cluster = memo(function Grid({ as = 'div', children, isWide, gap = 1, className, ...props }: Props) {
  const Tag = as;

  return (
    <Tag
      className={cx(className, clusterStyle)}
      data-is-wide={isWide}
      {...props}
      style={{
        // @ts-ignore CSS custom property
        '--cluster-space': `var(--space-${gap})`,
      }}
    >
      {children}
    </Tag>
  );
});
