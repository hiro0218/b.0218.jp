import { PostSection } from '@/components/Page/_shared/PostSection';
import { Anchor } from '@/components/UI/Anchor';
import { Center, Stack } from '@/components/UI/Layout';
import type { PostSummary } from '@/types/source';
import { css } from '@/ui/styled';

type Props = {
  posts: PostSummary[];
};

export default function Content({ posts }: Props) {
  return (
    <Stack align="center" className={ContainerStyle} direction="vertical" gap={5} justify="center">
      <Stack gap={3}>
        <Stack as="header" className={HeaderStyle}>
          <h1>404</h1>
          <p>お探しのページは見つかりませんでした</p>
        </Stack>
        <Stack gap={3}>
          <p>URLが変更・削除された可能性があります。</p>
          <Center intrinsic maxWidth="160px">
            <Anchor className={PrimaryAnchorStyle} href="/">
              トップへ戻る
            </Anchor>
          </Center>
        </Stack>
      </Stack>
      <Stack className={LatestPostContainerStyle} gap={2}>
        <PostSection as="section" heading="" headingLevel="h2" href="/archive" posts={posts.slice(0, 4)} />
      </Stack>
    </Stack>
  );
}

const ContainerStyle = css`
  width: 100%;
  padding-inline: var(--spacing-4);
`;

const LatestPostContainerStyle = css`
  width: min(100%, var(--sizes-container-md));
`;

const HeaderStyle = css`
  text-align: center;

  h1 {
    font-size: var(--font-sizes-h1);
  }

  p {
    font-size: var(--font-sizes-sm);
    color: var(--colors-gray-600);
  }
`;

const PrimaryAnchorStyle = css`
  width: 100%;
  padding: var(--spacing-1) var(--spacing-2);
  font-size: var(--font-sizes-sm);
  color: var(--colors-white);
  white-space: nowrap;
  background-color: var(--colors-gray-800);
  border-radius: var(--radii-sm);

  &:hover {
    background-color: var(--colors-gray-700);
  }
`;
