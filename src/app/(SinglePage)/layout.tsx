import { Container } from '@/components/Functional/Container';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function SinglePageLayout({ children }: Props) {
  return (
    <Container size="small">
      <section>{children}</section>
    </Container>
  );
}
