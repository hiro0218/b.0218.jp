import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import Footer from '@/components/App/TheFooter';
import Header from '@/components/App/TheHeader';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Container>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Container>
      <PageScroll />
    </>
  );
}

const Container = styled.div`
  height: 100vh;

  ${isDesktop} {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
`;

const Main = styled.main`
  max-width: var(--container-width);
  padding: 0 var(--space-4);
  margin: var(--space-3) auto 0;

  ${isMobile} {
    width: auto;
    padding: 0 5vw;
  }
`;
