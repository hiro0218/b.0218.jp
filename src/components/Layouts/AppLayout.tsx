import Footer from '@/components/App/TheFooter';
import Header from '@/components/App/TheHeader';
import { PageScroll } from '@/components/UI/PageScroll';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const CONTAINER_WIDTH = 800;

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
