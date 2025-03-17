import { Container } from '@/components/Functional/Container';
import { MainContainer } from '@/pages/_components/MainContainer';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SinglePageLayout({ children }: Props) {
  return (
    <MainContainer>
      <Container size="small">
        <section>{children}</section>
      </Container>
    </MainContainer>
  );
}
