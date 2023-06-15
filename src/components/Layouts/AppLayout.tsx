import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import Footer from '@/components/App/TheFooter';
import Header from '@/components/App/TheHeader';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
      <PageScroll />
    </>
  );
}

const Container = styled.main`
  max-width: var(--container-width);
  min-height: calc(100vh - var(--space-6) - 200px);
  padding: 0 var(--space-4);
  margin: 0 auto;

  ${isMobile} {
    padding: 0 5vw;
  }
`;
