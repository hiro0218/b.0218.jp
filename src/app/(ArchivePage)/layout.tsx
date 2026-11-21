import type { ReactNode } from 'react';
import { SectionInner } from '@/components/UI/Layout/SectionInner';
import { styled } from '@/ui/styled';

type Props = {
  children: ReactNode;
};

export default function ArchivePageLayout({ children }: Props) {
  return (
    <SectionInner size="default">
      <Page>{children}</Page>
    </SectionInner>
  );
}

const Page = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-title);
`;
