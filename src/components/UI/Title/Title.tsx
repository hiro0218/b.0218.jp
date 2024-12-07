import type { ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  heading: string;
  paragraph?: ReactNode;
};

export function Title({ heading, paragraph = undefined }: Props) {
  return (
    <Container>
      <h1 dangerouslySetInnerHTML={{ __html: heading }}></h1>
      {!!paragraph && <P>{paragraph}</P>}
    </Container>
  );
}

const Container = styled.header`
  overflow-wrap: break-word;
`;

const P = styled.p`
  margin-top: var(--space-1);
  font-size: var(--font-size-md);
  color: var(--color-gray-11);
`;
