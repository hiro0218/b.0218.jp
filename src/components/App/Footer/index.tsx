import { Anchor } from '@/components/UI/Anchor';
import { Container } from '@/components/UI/Layout/Container';
import { Logo } from '@/components/UI/Logo';
import { css, styled } from '@/ui/styled';

const Links = [
  { title: 'about', href: '/about' },
  { title: 'tags', href: '/tags' },
  { title: 'popular', href: '/popular' },
  { title: 'history', href: '/history' },
  { title: 'archive', href: '/archive' },
] as const;

export default function Footer() {
  return (
    <Root>
      <Container className={ContainerStyle} size="default">
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <Nav>
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
  position: relative;
  padding: var(--spacing-5) 0;
  isolation: isolate;

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    content: '';
    background-color: var(--colors-gray-a-100);
    clip-path: polygon(0 max(20vw, 300px), 100% 0, 100% 100%, 0 100%);
  }
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
