import { Anchor } from '@/components/UI/Anchor';
import { styled } from '@/ui/styled';

export default function Content() {
  return (
    <Container>
      <Paragraph>ページが見つかりませんでした。</Paragraph>
      <Anchor href="/">Home</Anchor>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 200px;
  color: var(--text-11);
`;

const Paragraph = styled.p`
  margin-right: var(--space-1);
`;
