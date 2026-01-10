import type { AriaRole, CSSProperties, JSX, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';
import { containerType } from '@/ui/styled/utilities';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceGap | 0;
  columns?: number | 'auto-fit';
  minItemWidth?: string;
  role?: AriaRole;
  className?: string;
  children: ReactNode;
};

export const Grid = ({
  as: GridTag = 'div',
  role,
  children,
  gap,
  columns = 2,
  minItemWidth = '16rem',
  className,
  ...props
}: Props) => {
  const gridStyle = cx(
    css`
      display: grid;

      @container (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    `,
    columns === 'auto-fit'
      ? css`
          grid-template-columns: repeat(auto-fit, minmax(min(var(--grid-min-item-width), 100%), 1fr));
        `
      : css`
          grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
        `,
  );

  const style = {
    ...(columns === 'auto-fit' && { '--grid-min-item-width': minItemWidth }),
    ...(typeof columns === 'number' && { '--grid-columns': columns.toString() }),
  } as CSSProperties;

  return (
    <GridTag role={role} {...props} className={cx(className, gridStyle, containerType)} data-gap={gap} style={style}>
      {children}
    </GridTag>
  );
};
