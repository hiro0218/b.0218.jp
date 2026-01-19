import type { AriaRole, CSSProperties, JSX, ReactNode } from 'react';

import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

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
  gap: var(--cluster-gap);
  justify-content: flex-start;
`;

const wideStyle = css`
  align-content: start;

  & > * {
    flex: 1 1 auto;
  }
`;

export function Cluster({ as: Tag = 'div', children, isWide, gap = 1, className, ...props }: Props) {
  const style = { '--cluster-gap': `var(--spacing-${gap})` } as CSSProperties;

  return (
    <Tag className={cx(className, clusterStyle, isWide && wideStyle)} style={style} {...props}>
      {children}
    </Tag>
  );
}
