import { AriaRole, CSSProperties, memo, ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  tagName?: 'div' | 'section';
  space?: CSSProperties['margin'];
  role?: AriaRole;
  children: ReactNode;
};

const StackRoot = styled.div<Props>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * + * {
    margin-top: ${(props) => props.space || 'var(--space-md)'};
  }
`;

const Stack = memo(function Stack({ tagName = 'div', children, ...props }: Props) {
  return (
    <StackRoot as={tagName} {...props}>
      {children}
    </StackRoot>
  );
});

export default Stack;
