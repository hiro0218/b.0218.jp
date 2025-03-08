import type { AriaRole, CSSProperties, JSX, ReactNode } from 'react';

import { css, cx } from '@/ui/styled/static';
import type { SpaceGap } from '@/ui/styled/variables/space';
import { SPACE_KEYS } from '@/ui/styled/variables/space';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  space?: SpaceGap;
  direction?: 'vertical' | 'horizontal';
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  role?: AriaRole;
  className?: string;
  children: ReactNode;
};

const tagStyle = css`
  display: flex;
  flex-wrap: var(--stack-wrap);
  gap: var(--stack-space);
  align-items: var(--stack-align);
  justify-content: var(--stack-justify);

  & > * {
    margin-block: 0;
  }

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
  space = 2,
  align,
  justify = 'flex-start',
  wrap,
  className = '',
  ...props
}: Props) => {
  const spaceGap = SPACE_KEYS.includes(`--space-${space}`) ? `var(--space-${space})` : `var(--space-2)`;

  return (
    <Tag
      className={cx(className, tagStyle)}
      data-direction={direction}
      style={
        {
          '--stack-space': spaceGap,
          '--stack-align': align,
          '--stack-justify': justify,
          '--stack-wrap': wrap,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </Tag>
  );
};
