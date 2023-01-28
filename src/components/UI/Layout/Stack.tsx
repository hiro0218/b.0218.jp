import { AriaRole, CSSProperties, memo, ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  as?: 'div' | 'section';
  space?: CSSProperties['margin'];
  role?: AriaRole;
  children: ReactNode;
};

const StackRoot = styled.div<Props>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * + * {
    margin-top: ${({ space }) => space || 'var(--space-3)'};
  }
`;

const Stack = memo(function Stack({ as = 'div', children, ...props }: Props) {
  return (
    <StackRoot as={as} {...props}>
      {children}
    </StackRoot>
  );
});

export default Stack;
