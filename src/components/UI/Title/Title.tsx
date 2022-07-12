import { ReactNode } from 'react';

import { getModularScale } from '@/lib/modular-scale';
import { styled } from '@/ui/styled';

type Props = {
  heading: string;
  paragraph?: string;
  children?: ReactNode;
};

export const Title = ({ heading, paragraph, children }: Props) => (
  <header>
    <H1>{heading}</H1>
    {paragraph && <P>{paragraph}</P>}
    {children}
  </header>
);

const H1 = styled.h1`
  font-size: ${getModularScale({ degree: 4 })};
  line-height: 1.5;
`;

const P = styled.p`
  margin-top: var(--space-xs);
  color: var(--text-11);
  font-size: var(--font-size-lg);
`;
