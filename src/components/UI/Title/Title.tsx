import { getModularScale } from '@/lib/modular-scale';
import { styled } from '@/ui/styled';

type Props = {
  heading: string;
  paragraph?: string;
};

export const Title = ({ heading, paragraph }: Props) => (
  <section>
    <H1>{heading}</H1>
    {paragraph && <P>{paragraph}</P>}
  </section>
);

const H1 = styled.h1`
  font-size: ${getModularScale({ degree: 5 })};
  line-height: 1.5;
`;

const P = styled.p`
  margin-top: var(--space-xs);
  color: var(--text-11);
  font-size: var(--font-size-lg);
`;
