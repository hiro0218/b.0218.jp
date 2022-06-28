import Link from 'next/link';

import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

export const TheFooter = () => (
  <Footer>
    <Container>
      <List role="list">
        <ListItem role="listitem">
          <Link href="/about" prefetch={false} passHref>
            <a>about</a>
          </Link>
        </ListItem>
        <ListItem role="listitem">
          <Link href="/archive" prefetch={false} passHref>
            <a>archive</a>
          </Link>
        </ListItem>
        <ListItem role="listitem">
          <Link href="/tags" prefetch={false} passHref>
            <a>tags</a>
          </Link>
        </ListItem>
      </List>
      <small>© hiro</small>
    </Container>
  </Footer>
);

const Footer = styled.footer`
  position: sticky;
  top: 100vh;
  margin-top: var(--space-x-xl);
  padding: var(--space-xl) 0;
  background-color: var(--component-backgrounds-3);
  color: var(--text-12);
  font-size: var(--font-size-sm);

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

  &:not(:first-of-type) {
    margin-left: 1em;
  }
`;
