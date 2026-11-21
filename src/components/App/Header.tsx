import { Logo } from '@/components/App/Logo';
import { SearchTrigger } from '@/components/App/Search/SearchTrigger';
import { SectionInner } from '@/components/UI/Layout/SectionInner';
import { css, styled } from '@/ui/styled';
import { Layout } from './Header/Layout';
import { Navigation } from './Header/Navigation';

export function Header() {
  return (
    <Layout>
      <SectionInner className={HeaderInnerStyle} size={'large'}>
        <LogoOuter>
          <Logo />
        </LogoOuter>
        <NavigationGroup>
          <Navigation />
          <SearchTrigger />
        </NavigationGroup>
      </SectionInner>
    </Layout>
  );
}

const HeaderInnerStyle = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  margin: 0 auto;
`;

const LogoOuter = styled.div`
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
