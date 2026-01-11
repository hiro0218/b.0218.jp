import type { ReactNode } from 'react';
import { Stack } from '@/components/UI/Layout';
import { Container } from '@/components/UI/Layout/Container';

type Props = {
  children: ReactNode;
};

export default function ArchivePageLayout({ children }: Props) {
  return (
    <Container size="small">
      <Stack as="section" gap={4}>
        {children}
      </Stack>
    </Container>
  );
}
