import { Container } from '@/components/Functional/Container';
import { Stack } from '@/components/UI/Layout';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ArchivePageLayout({ children }: Props) {
  return (
    <Container size="small">
      <Stack as="section" space={4}>
        {children}
      </Stack>
    </Container>
  );
}
