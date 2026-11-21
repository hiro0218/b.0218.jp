import type { ReactNode } from 'react';
import { SectionInner } from '@/components/UI/Layout/SectionInner';

type Props = {
  children: ReactNode;
};

export default function SinglePageLayout({ children }: Props) {
  return (
    <SectionInner size="default">
      <section>{children}</section>
    </SectionInner>
  );
}
