import Footer from '@/components/App/TheFooter';
import Header from '@/components/App/TheHeader';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

export default function AppLayout({ children }) {
  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </>
  );
}

const Container = styled.main`
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;

  ${isMobile} {
    padding: 0 5vw;
  }
`;
