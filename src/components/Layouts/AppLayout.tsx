import AppFooter from '@/components/App/TheFooter';
import AppHeader from '@/components/App/TheHeader';
import { MainContainer } from '@/components/UI/Layout';

export default function AppLayout({ children }) {
  return (
    <>
      <AppHeader />
      <MainContainer>{children}</MainContainer>
      <AppFooter />
    </>
  );
}
