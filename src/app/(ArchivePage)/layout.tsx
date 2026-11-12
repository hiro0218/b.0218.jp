import type { ReactNode } from 'react';
import { Container } from '@/components/UI/Layout/Container';
import { styled } from '@/ui/styled';

type Props = {
  children: ReactNode;
};

export default function ArchivePageLayout({ children }: Props) {
  return (
    <Container size="default">
      <Page>{children}</Page>
    </Container>
  );
}

const Page = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-title);
`;
