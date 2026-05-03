import type { ReactNode } from 'react';
import { Container } from '@/components/UI/Layout/Container';
import { Stack } from '@/components/UI/Layout/Stack';

type Props = {
  children: ReactNode;
};

export default function PostPageLayout({ children }: Props) {
  return (
    <Container size="default">
      <Stack as="section" gap={4}>
        {children}
      </Stack>
    </Container>
  );
}
