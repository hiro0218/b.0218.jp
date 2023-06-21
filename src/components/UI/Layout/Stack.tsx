import type { AriaRole, ReactNode } from 'react';
import { memo, useMemo } from 'react';

import { css, styled } from '@/ui/styled';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  space?: '½' | '1' | '2' | '3' | '4' | '5' | '6';
  direction?: 'vertical' | 'horizontal';
  role?: AriaRole;
  children: ReactNode;
};

const StackRoot = styled.div<Props>`
  display: flex;
  flex-direction: ${({ direction = 'vertical' }) => (direction === 'horizontal' ? 'row' : 'column')};
  justify-content: flex-start;

  & > * {
    margin-block: 0;
  }

  & > * + * {
    ${({ space = '2', direction = 'vertical' }) =>
      direction === 'horizontal'
        ? css`
            margin-inline-start: var(--space-${space});
          `
        : css`
            margin-block-start: var(--space-${space});
          `};
  }
`;

const Stack = memo(function Stack({ as = 'div', children, ...props }: Props) {
  const MemoizedStackRoot = useMemo(() => StackRoot.withComponent(as), [as]);

  return (
    <MemoizedStackRoot as={as} {...props}>
      {children}
    </MemoizedStackRoot>
  );
});

export default Stack;
