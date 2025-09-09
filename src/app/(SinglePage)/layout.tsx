import type { ReactNode } from 'react';
import { Container } from '@/components/UI/Layout/Container';

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
