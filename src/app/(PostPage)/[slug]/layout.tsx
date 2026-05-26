import type { ReactNode } from 'react';
import { PostContainer } from '@/components/Page/Post/PostContainer';
import { Stack } from '@/components/UI/Layout/Stack';

type Props = {
  children: ReactNode;
};

export default function PostPageLayout({ children }: Props) {
  return (
    <PostContainer>
      <Stack as="section" gap={4}>
        {children}
      </Stack>
    </PostContainer>
  );
}
