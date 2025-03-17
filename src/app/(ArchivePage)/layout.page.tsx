import { Container } from '@/components/Functional/Container';
import { Stack } from '@/components/UI/Layout';
import { MainContainer } from '@/pages/_components/MainContainer';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function ArchivePageLayout({ children }: Props) {
  return (
    <MainContainer>
      <Container size="small">
        <Stack as="section" space={4}>
          {children}
        </Stack>
      </Container>
    </MainContainer>
  );
}
