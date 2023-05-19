import { type AriaRole, memo, type ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  as?: 'div' | 'section';
  space?: 'half' | '1' | '2' | '3' | '4' | '5' | '6';
  role?: AriaRole;
  children: ReactNode;
};

const StackRoot = styled.div<Props>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * + * {
    margin-top: ${({ space = '2' }) => `var(--space-${space})`};
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
