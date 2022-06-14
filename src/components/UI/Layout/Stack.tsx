import { AriaRole, CSSProperties, memo, ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  space?: CSSProperties['margin'];
  role?: AriaRole;
  children: ReactNode;
};

const StackRoot = styled.div<Props>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * + * {
    margin-block-start: ${(props) => props.space || 'var(--space-md)'};
  }
`;

const Stack = memo(function Stack({ children, ...props }: Props) {
  return <StackRoot {...props}>{children}</StackRoot>;
});

export default Stack;
