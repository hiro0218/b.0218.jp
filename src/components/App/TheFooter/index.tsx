import { Anchor } from '@/components/UI/Anchor';
import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

const Links = [
  { title: 'about', href: '/about' },
  { title: 'works', href: '/works' },
  { title: 'tags', href: '/tags' },
  { title: 'archive', href: '/archive' },
];

const TheFooter = () => (
  <Footer>
    <Container>
      <List role="list">
        {Links.map(({ title, href }, index) => {
          return (
            <ListItem role="listitem" key={index}>
              <Anchor href={href}>{title}</Anchor>
            </ListItem>
          );
        })}
      </List>
      <small>© hiro</small>
    </Container>
  </Footer>
);

export default TheFooter;

const Footer = styled.footer`
  position: sticky;
  top: 100vh;
  margin-top: var(--space-x-xl);
  padding: var(--space-x-xl) 0;
  background-color: var(--component-backgrounds-3);
  color: var(--text-12);
  font-size: var(--font-size-md);

  a {
    color: inherit;

    &:hover {
      text-decoration-line: underline;
    }
  }

  small {
    font-size: 1rem;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-width);
  margin: 0 auto;

  ${mobile} {
    padding: 0 5vw;
  }
`;

const List = styled.div`
  display: inline-flex;
`;

const ListItem = styled.div`
  display: inline-flex;

  & + & {
    margin-left: 1em;
  }
`;
