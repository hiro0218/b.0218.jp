import type { CSSProperties, JSX, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  padding?: SpaceGap;
  className?: string;
  children?: ReactNode;
};

const boxStyle = css`
  padding: var(--box-padding, 0);
`;

export const Box = ({ as: Tag = 'div', padding, className, children, ...props }: Props) => {
  const style = padding !== undefined ? ({ '--box-padding': `var(--spacing-${padding})` } as CSSProperties) : undefined;

  return (
    <Tag className={cx(className, boxStyle)} style={style} {...props}>
      {children}
    </Tag>
  );
};
