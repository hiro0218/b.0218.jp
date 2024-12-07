import { Container as _Container, getSize } from '@/components/Functional/Container';
import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { LinkStyle } from '@/components/UI/LinkMenu';
import { isMobile } from '@/ui/lib/mediaQuery';
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

  small {
    font-size: var(--font-size-sm);
  }
`;

const Container = styled(_Container)`
  display: flex;
  flex-direction: row-reverse;
  gap: var(--space-3);
  justify-content: space-between;
  margin: auto;
  font-size: var(--font-size-md);
  color: var(--color-gray-12);

  ${isMobile} {
    flex-direction: column;
    align-items: center;
  }

  & > * {
    display: flex;
    align-items: center;
    justify-content: space-between;

    ${isMobile} {
      gap: var(--space-2);
      justify-content: unset;
    }
  }

  small {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-bold);
    color: var(--color-gray-11);
  }
`;

const Nav = styled.nav`
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;

  ${isMobile} {
    gap: var(--space-1);
  }
`;

const Anchor = styled(_Anchor)`
  ${LinkStyle}

  display: flex;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-md);
  text-align: center;

  ${isMobile} {
    padding: var(--space-1) var(--space-2);
  }
`;
