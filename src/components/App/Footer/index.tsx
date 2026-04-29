import { Anchor } from '@/components/UI/Anchor';
import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { css, styled } from '@/ui/styled';

const Links = [
  { title: 'about', href: '/about' },
  { title: 'tags', href: '/tags' },
  { title: 'popular', href: '/popular' },
  { title: 'archive', href: '/archive' },
] as const;

export default function Footer() {
  return (
    <Root>
      <Container className={ContainerStyle} size="default">
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <Nav aria-label="フッターナビゲーション">
          {Links.map(({ title, href }) => (
            <Anchor className="link-style link-style--hover-effect" href={href} key={href}>
              {title}
            </Anchor>
          ))}
        </Nav>
        <small className={copyrightStyle}>© hiro</small>
      </Container>
    </Root>
  );
}

const Root = styled.footer`
  padding: var(--spacing-5) 0;
  margin-top: var(--spacing-6);
  border-top: var(--border-widths-thin) solid var(--colors-gray-200);
`;

const ContainerStyle = css`
  display: grid;
  gap: var(--spacing-2);
  margin: auto;
  font-size: var(--font-sizes-md);
  color: var(--colors-gray-1000);
`;

const LogoContainer = styled.div`
  display: flex;
  margin-left: calc(var(--spacing-1) * -1);
`;

const Nav = styled.nav`
  display: inline-flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  align-items: center;
  margin-left: calc(var(--spacing-1) * -1);
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-sm);
`;

const copyrightStyle = css`
  margin-top: var(--spacing-2);
  font-size: var(--font-sizes-xs);
  font-weight: var(--font-weights-bold);
  color: var(--colors-gray-600);
`;
