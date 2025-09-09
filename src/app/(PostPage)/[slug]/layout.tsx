import type { ReactNode } from 'react';
import { Stack } from '@/components/UI/Layout';
import { Container } from '@/components/UI/Layout/Container';

type Props = {
  children: ReactNode;
};

export default function PostPageLayout({ children }: Props) {
  return (
    <Container size="default">
      <Stack as="section" space={4}>
        {children}
      </Stack>
    </Container>
  );
}
