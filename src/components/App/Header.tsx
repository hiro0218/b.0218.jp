import { SearchTrigger } from '@/components/App/Search/SearchTrigger';
import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { css, styled } from '@/ui/styled';
import { Layout } from './Header/Layout';
import { HeaderNavigation } from './Header/Navigation';

export function Header() {
  return (
    <Layout>
      <Container className={HeaderContainerStyle} size={'large'}>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <NavigationGroup>
          <HeaderNavigation />
          <SearchTrigger />
        </NavigationGroup>
      </Container>
    </Layout>
  );
}

const HeaderContainerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-left: calc(var(--control-padding-inline) * -1);
`;

const NavigationGroup = styled.div`
  display: flex;
  gap: var(--spacing-75);
  align-items: center;
  margin-right: calc((var(--control-min-size) - var(--sizes-icon-xs)) / -2);

  /* ナビと検索の間は、ナビの項目どうし（文字の間 40）と同じ幅にしない。同じだと、別のまとまりと読めない */
  @media (--isDesktop) {
    gap: var(--spacing-400);
  }
`;
