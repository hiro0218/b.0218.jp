import { Anchor } from '@/components/UI/Anchor';
import { Stack } from '@/components/UI/Layout';
import { css, styled } from '@/ui/styled/static';

export default function Content() {
  return (
    <Stack align="center" className={ContainerStyle} direction="vertical" justify="center" space={3}>
      <Header>
        <h1>Page not found</h1>
        <p>ページが見つかりませんでした</p>
      </Header>
      <Stack space={4}>
        <p>アクセスしようとしたページは、削除もしくはURLが変更され利用できない可能性があります。</p>
        <Anchor className={AnchorStyle} href="/">
          トップへ戻る
        </Anchor>
      </Stack>
    </Stack>
  );
}

const ContainerStyle = css`
  height: 100%;
  padding-inline: var(--space-4);
  text-align: center;
`;

const Header = styled.header`
  h1 {
    font-size: var(--font-size-h1);
  }

  p {
    font-size: var(--font-size-sm);
    color: var(--color-gray-11);
  }
`;

const AnchorStyle = css`
  width: 120px;
  padding: var(--space-1) var(--space-2);
  margin-inline: auto;
  font-size: var(--font-size-sm);
  background-color: var(--color-gray-3);
  border-radius: var(--border-radius-4);

  &:hover {
    background-color: var(--color-gray-4);
  }
`;
