import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { Stack } from '@/components/UI/Layout';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { Title } from '@/components/UI/Title';
import { styled } from '@/ui/styled';

export default function Content() {
  return (
    <Container align="center" direction="vertical" justify="center" space={3}>
      <Title heading="Page not found" paragraph="ページが見つかりませんでした" />
      <p>アクセスしようとしたページは、削除もしくはURLが変更され利用できない可能性があります。</p>
      <Anchor href="/">Home へ戻る</Anchor>
    </Container>
  );
}

const Container = styled(Stack)`
  height: 100%;
  text-align: center;
`;

const Anchor = styled(_Anchor)`
  ${LinkStyle}

  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-md);
`;
