import dynamic from 'next/dynamic';

import Footer from '@/components/App/TheFooter';
import Header from '@/components/App/TheHeader';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const CONTAINER_WIDTH = 800;
const PageScroll = dynamic(() => import('@/components/UI/PageScroll').then((module) => module.PageScroll));

export default function AppLayout({ children }) {
  return (
    <>
      <Header containerWidth={CONTAINER_WIDTH} />
      <Container>{children}</Container>
      <PageScroll />
      <Footer containerWidth={CONTAINER_WIDTH} />
    </>
  );
}

const Container = styled.main`
  max-width: ${CONTAINER_WIDTH}px;
  margin: 0 auto;
  padding: 0 var(--space-4);

  ${isMobile} {
    padding: 0 5vw;
  }
`;
