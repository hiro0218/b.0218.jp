import { Container } from '@/components/Functional/Container';
import { Stack } from '@/components/UI/Layout';
import type { ReactNode } from 'react';

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
