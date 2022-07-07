import { getModularScale } from '@/lib/modular-scale';
import { styled } from '@/ui/styled';

export const Hero = () => (
  <>
    <Heading>Hello, I&apos;m hiro.</Heading>
    <Paragraph>
      I was a web backend developer and native app developer. Currently I am a web front-end developer.
    </Paragraph>
  </>
);

const Heading = styled.h1`
  font-size: ${getModularScale({ degree: 5 })};
  line-height: 1.5;
`;

const Paragraph = styled.p`
  margin-top: var(--space-xs);
  color: var(--text-11);
  font-size: var(--font-size-lg);
`;
