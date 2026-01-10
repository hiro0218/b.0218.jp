import { Anchor } from '@/components/UI/Anchor';
import { Center, Stack } from '@/components/UI/Layout';
import { css, styled } from '@/ui/styled';

export default function Content() {
  return (
    <Stack align="center" className={ContainerStyle} direction="vertical" gap={3} justify="center">
      <Header>
        <h1>Page not found</h1>
        <p>ページが見つかりませんでした</p>
      </Header>
      <Stack gap={4}>
        <p>アクセスしようとしたページは、削除もしくはURLが変更され利用できない可能性があります。</p>
        <Center intrinsic maxWidth="120px">
          <Anchor className={AnchorStyle} href="/">
            トップへ戻る
          </Anchor>
        </Center>
      </Stack>
    </Stack>
  );
}

const ContainerStyle = css`
  height: 100%;
  padding-inline: var(--spacing-4);
  text-align: center;
`;

const Header = styled.header`
  h1 {
    font-size: var(--font-sizes-h1);
  }

  p {
    font-size: var(--font-sizes-sm);
    color: var(--colors-gray-900);
  }
`;

const AnchorStyle = css`
  width: 120px;
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-sizes-sm);
  background-color: var(--colors-gray-100);
  border-radius: var(--radii-4);

  &:hover {
    background-color: var(--colors-gray-200);
  }
`;
