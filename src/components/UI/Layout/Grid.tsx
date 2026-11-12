import type { CSSProperties, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import { gapClasses } from '@/ui/styled/atomic/spacing';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props = {
  minItemWidth?: string;
  gap?: SpaceGap;
  className?: string;
  children: ReactNode;
};

const gridStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(var(--grid-min-item-width), 100%), 1fr));
`;

/**
 * @summary CSS Grid レイアウト（auto-fit）
 */
export const Grid = ({ children, minItemWidth = '16rem', gap, className }: Props) => {
  const style = { '--grid-min-item-width': minItemWidth } as CSSProperties;

  return (
    <div className={cx(gridStyle, gap !== undefined && gapClasses[gap], className)} style={style}>
      {children}
    </div>
  );
};
