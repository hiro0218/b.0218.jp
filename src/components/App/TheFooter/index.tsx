import { memo } from 'react';

import { WaveUp } from '@/components/Functional/Wave';
import { Anchor } from '@/components/UI/Anchor';
import { isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

const Links = [
  { title: 'about', href: '/about' },
  { title: 'tags', href: '/tags' },
  { title: 'archive', href: '/archive' },
] as const;

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
    width: 100%;
    padding: var(--space-xs) var(--space-sm);
    border-radius: 0.25rem;
    color: inherit;
    text-align: center;

    ${isMobile} {
      padding: var(--space-x-xs) var(--space-xs);
    }

    &:hover {
      background-color: var(--component-backgrounds-3A);
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
    gap: var(--space-xl);
  }
`;

const List = styled.ul`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);

  ${isMobile} {
    width: 65vw;
  }
`;

const ListItem = styled.li`
  display: inline-flex;
  justify-content: center;

  ${isMobile} {
    width: calc(100% / ${Links.length});
  }
`;
