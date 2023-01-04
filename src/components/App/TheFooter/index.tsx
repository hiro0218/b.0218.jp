import { memo } from 'react';

import { WaveUp } from '@/components/Functional/Wave';
import { Anchor } from '@/components/UI/Anchor';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { showHoverBackground } from '@/ui/mixin';
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
    padding: var(--space-xs) var(--space-sm);
    border-radius: 0.25rem;
    color: inherit;

    ${isMobile} {
      padding: var(--space-md);
    }

    &:hover {
      background-color: var(--component-backgrounds-3A);
    }

    &:focus-within {
      box-shadow: 0 0 0 2px var(--borders-7);
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
    flex-direction: column;
    gap: var(--space-md);
    padding: 0 5vw;
  }
`;

const List = styled.ul`
  display: inline-flex;
`;

const ListItem = styled.li`
  display: inline-flex;

  ${isDesktop} {
    & + & {
      margin-left: var(--space-sm);
    }
  }
`;
