import type { AriaRole, CSSProperties, ReactNode } from 'react';

import { css, styled } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/CssBaseline/Settings/Space';

type Props = {
  as?: keyof JSX.IntrinsicElements;
  space?: SpaceGap;
  direction?: 'vertical' | 'horizontal';
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: CSSProperties['flexWrap'];
  role?: AriaRole;
  children: ReactNode;
};

type StackRootProps = Omit<Props, 'direction'> & {
  flexDirection?: 'vertical' | 'horizontal';
};

const StackRoot = styled.div<StackRootProps>`
  display: flex;
  flex-direction: ${({ flexDirection = 'vertical' }) => (flexDirection === 'horizontal' ? 'row' : 'column')};
  flex-wrap: ${({ wrap }) => wrap};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};

  & > * {
    margin-block: 0;
  }

  & > * + * {
    ${({ space = 2, flexDirection = 'vertical' }) =>
      flexDirection === 'horizontal'
        ? css`
            margin-inline-start: var(--space-${space});
          `
        : css`
            margin-block-start: var(--space-${space});
          `};
  }
`;

export const Stack = ({ as = 'div', children, ...props }: Props) => {
  const { direction, ...rest } = props;

  return (
    <StackRoot as={as} flexDirection={direction} {...rest}>
      {children}
    </StackRoot>
  );
};
