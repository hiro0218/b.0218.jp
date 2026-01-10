import type { AriaRole, CSSProperties, JSX, ReactNode } from 'react';
import { css, cx } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  gap?: SpaceGap;
  direction?: 'vertical' | 'horizontal';
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  role?: AriaRole;
  className?: string;
  children: ReactNode;
};

const stackStyle = css`
  display: flex;
  flex-wrap: var(--stack-wrap, nowrap);
  align-items: var(--stack-align, stretch);
  justify-content: var(--stack-justify, flex-start);

  &[data-direction='horizontal'] {
    flex-direction: row;
  }

  &[data-direction='vertical'] {
    flex-direction: column;
  }
`;

export const Stack = ({
  as: Tag = 'div',
  children,
  direction = 'vertical',
  gap = 2,
  align,
  justify,
  wrap,
  className,
  ...props
}: Props) => {
  const style = {
    ...(align && { '--stack-align': align }),
    ...(justify && { '--stack-justify': justify }),
    ...(wrap && { '--stack-wrap': wrap }),
  } as CSSProperties;

  return (
    <Tag className={cx(className, stackStyle)} data-direction={direction} data-gap={gap} style={style} {...props}>
      {children}
    </Tag>
  );
};
