import { Container } from '@/components/Functional/Container';
import { Anchor } from '@/components/UI/Anchor';
import { Logo } from '@/components/UI/Logo';
import { css, styled } from '@/ui/styled/static';

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
        <Nav>
          {Links.map(({ title, href }) => (
            <Anchor href={href} key={href + title}>
              {title}
            </Anchor>
          ))}
        </Nav>
        <small
          className={css`
            font-size: var(--font-size-xs);
            font-weight: var(--font-weight-bold);
            color: var(--color-gray-11);
          `}
        >
          © hiro
        </small>
      </Container>
    </Root>
  );
}

const Root = styled.footer`
  padding: var(--space-5) 0;
  margin-top: var(--space-6);
  background-color: var(--color-gray-3);
`;

const ContainerStyle = css`
  display: grid;
  gap: var(--space-2);
  margin: auto;
  font-size: var(--font-size-md);
  color: var(--color-gray-12);
`;

const LogoContainer = styled.div`
  display: flex;
  margin-left: calc(var(--space-1) * -1);
`;

const Nav = styled.nav`
  display: inline-flex;
  gap: var(--space-3);
  align-items: center;

  a {
    &:hover,
    &:focus-visible {
      text-decoration-line: underline;
      text-decoration-thickness: 2px;
    }
  }
`;
