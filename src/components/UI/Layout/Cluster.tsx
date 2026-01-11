import type { AriaRole, JSX, ReactNode } from 'react';

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
  justify-content: flex-start;

  &[data-is-wide='true'] {
    align-content: start;
    & > * {
      flex: 1 1 auto;
    }
  }
`;

export function Cluster({ as: Tag = 'div', children, isWide, gap = 1, className, ...props }: Props) {
  return (
    <Tag className={cx(className, clusterStyle)} {...(isWide && { 'data-is-wide': isWide })} {...props} data-gap={gap}>
      {children}
    </Tag>
  );
}
