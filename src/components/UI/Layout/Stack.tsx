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

type StackRootProps = Omit<Props, 'direction'> & {
  flexDirection?: 'vertical' | 'horizontal';
};

const StackRoot = styled.div<StackRootProps>`
  display: flex;
  flex-direction: ${({ flexDirection = 'vertical' }) => (flexDirection === 'horizontal' ? 'row' : 'column')};
  justify-content: flex-start;

  & > * {
    margin-block: 0;
  }

  & > * + * {
    ${({ space = '2', flexDirection = 'vertical' }) =>
      flexDirection === 'horizontal'
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
  const { direction, ...rest } = props;

  return (
    <MemoizedStackRoot as={as} flexDirection={direction} {...rest}>
      {children}
    </MemoizedStackRoot>
  );
});

export default Stack;
