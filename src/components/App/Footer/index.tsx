import { Container as _Container, getSize } from '@/components/Functional/Container';
import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { SITE_NAME } from '@/constant';
import { styled } from '@/ui/styled';

const Links = [
  { title: 'about', href: '/about' },
  { title: 'tags', href: '/tags' },
  { title: 'popular', href: '/popular' },
  { title: 'archive', href: '/archive' },
] as const;

export default function Footer() {
  const size = getSize('default');
  return (
    <Root>
      <Container size={size}>
        <img src="/logo.v2.svg" alt={SITE_NAME} height="25" width="80" />
        <Nav>
          {Links.map(({ title, href }) => (
            <Anchor href={href} key={href + title}>
              {title}
            </Anchor>
          ))}
        </Nav>
        <small>© hiro</small>
      </Container>
    </Root>
  );
}

const Root = styled.footer`
  padding: var(--space-5) 0;
  margin-top: var(--space-6);
  background-color: var(--color-gray-3);
`;

const Container = styled(_Container)`
  display: grid;
  gap: var(--space-3);
  margin: auto;
  font-size: var(--font-size-md);
  color: var(--color-gray-12);

  small {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-11);
  }
`;

const Nav = styled.nav`
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
`;

const Anchor = styled(_Anchor)`
  &:hover,
  &:focus-visible {
    text-decoration-line: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4%;
  }
`;
