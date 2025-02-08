import { css, cx } from '@/ui/styled/static';
import type { SpaceGap } from '@/ui/styled/variables/space';
import type { ReactNode } from 'react';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  mt?: SpaceGap;
  className?: string;
  children?: ReactNode;
};

const boxStyle = css`
  &[data-mt='½'] {
    margin-top: var(--space-½);
  }

  &[data-mt='1'] {
    margin-top: var(--space-1);
  }

  &[data-mt='2'] {
    margin-top: var(--space-2);
  }

  &[data-mt='3'] {
    margin-top: var(--space-3);
  }

  &[data-mt='4'] {
    margin-top: var(--space-4);
  }

  &[data-mt='5'] {
    margin-top: var(--space-5);
  }

  &[data-mt='6'] {
    margin-top: var(--space-6);
  }
`;

export const Box = ({ as = 'div', mt = undefined, className = '', children, ...props }: Props) => {
  const Tag = as;

  return (
    <Tag {...(mt && { 'data-mt': mt })} className={cx(boxStyle, className)} {...props}>
      {children}
    </Tag>
  );
};
