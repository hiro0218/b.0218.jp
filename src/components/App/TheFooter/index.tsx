import { Anchor } from '@/components/UI/Anchor';
import { mobile } from '@/lib/mediaQuery';
import { styled } from '@/ui/styled';

const TheFooter = () => (
  <Footer>
    <Container>
      <List role="list">
        <ListItem role="listitem">
          <Anchor href="/about" prefetch={false} passHref>
            <a>about</a>
          </Anchor>
        </ListItem>
        <ListItem role="listitem">
          <Anchor href="/archive" prefetch={false} passHref>
            <a>archive</a>
          </Anchor>
        </ListItem>
        <ListItem role="listitem">
          <Anchor href="/tags" prefetch={false} passHref>
            <a>tags</a>
          </Anchor>
        </ListItem>
        <ListItem role="listitem">
          <Anchor href="/works" prefetch={false} passHref>
            <a>works</a>
          </Anchor>
        </ListItem>
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
