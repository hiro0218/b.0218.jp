import type { AriaRole, CSSProperties, ReactNode } from 'react';

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
  align-items: var(--stack-align);
  justify-content: var(--stack-justify);

  & > * {
    margin-block: 0;
  }

  &[data-direction='horizontal'] {
    flex-direction: row;
    & > * + * {
      margin-inline-start: var(--stack-space);
    }
  }

  &[data-direction='vertical'] {
    flex-direction: column;
    & > * + * {
      margin-block-start: var(--stack-space);
    }
  }
`;

export const Stack = ({
  as = 'div',
  children,
  direction = 'vertical',
  space = 2,
  align,
  justify = 'flex-start',
  wrap,
  className = '',
  ...props
}: Props) => {
  const Tag = as;
  const spaceGap = SPACE_KEYS.includes(`--space-${space}`) ? `var(--space-${space})` : `var(--space-2)`;

  return (
    <Tag
      className={cx(className, tagStyle)}
      data-direction={direction}
      style={{
        // @ts-ignore CSS Custom Properties
        '--stack-space': spaceGap,
        '--stack-align': align,
        '--stack-justify': justify,
        '--stack-wrap': wrap,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};
