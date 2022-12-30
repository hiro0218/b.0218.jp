import { memo } from 'react';

import { WaveUp } from '@/components/Functional/Wave';
import { Anchor } from '@/components/UI/Anchor';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const Links = [
  { title: 'about', href: '/about' },
  { title: 'works', href: '/works' },
  { title: 'tags', href: '/tags' },
  { title: 'archive', href: '/archive' },
];

const TheFooter = memo(function TheFooter() {
  return (
    <Root>
      <WaveUp fill="var(--component-backgrounds-3)" />
      <Footer>
        <Container>
          <List>
            {Links.map(({ title, href }, index) => {
              return (
                <ListItem key={index}>
                  <Anchor href={href}>{title}</Anchor>
                </ListItem>
              );
            })}
          </List>
          <small>© hiro</small>
        </Container>
      </Footer>
    </Root>
  );
});

export default TheFooter;

const Root = styled.footer`
  display: flex;
  position: sticky;
  top: 100vh;
  flex-direction: column;
  margin-top: var(--space-x-xl);
`;

const Footer = styled.div`
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

  ${isMobile} {
    padding: 0 5vw;
  }
`;

const List = styled.ul`
  display: inline-flex;
`;

const ListItem = styled.li`
  display: inline-flex;

  & + & {
    margin-left: 1em;
  }
`;
