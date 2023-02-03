import dynamic from 'next/dynamic';

import Footer from '@/components/App/TheFooter';
import Header from '@/components/App/TheHeader';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <PageScroll />
      <Footer />
    </>
  );
}

const Container = styled.main`
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-4);

  ${isMobile} {
    padding: 0 5vw;
  }
`;
