import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import Footer from '@/components/App/TheFooter';
import Header from '@/components/App/TheHeader';
import { Container } from '@/components/UI/Layout';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Root>
        <Header />
        <Main as="main">{children}</Main>
        <Footer />
      </Root>
      <PageScroll />
    </>
  );
}

const Root = styled.div`
  height: 100vh;

  ${isDesktop} {
    display: grid;
    grid-template-rows: auto 1fr auto;
  }
`;

const Main = styled(Container)`
  margin: var(--space-3) auto 0;

  ${isMobile} {
    padding: 0 2rem;
  }
`;
