import type { ReactNode } from 'react';
import { PostInner } from '@/components/Page/Post/PostInner';
import { Stack } from '@/components/UI/Layout/Stack';

type Props = {
  children: ReactNode;
};

export default function PostPageLayout({ children }: Props) {
  return (
    <PostInner>
      <Stack as="section" gap={600}>
        {children}
      </Stack>
    </PostInner>
  );
}
