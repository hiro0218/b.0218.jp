import { memo } from 'react';

import { WaveBottom } from '@/components/Functional/Wave';
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

export default memo(function TheFooter() {
  return (
    <Root>
      <WaveBottom />
      <Footer>
        <Container>
          <List>
            {Links.map(({ title, href }) => {
              return (
                <ListItem key={href + title}>
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

const Root = styled.footer`
  display: flex;
  flex-direction: column;
  margin-top: var(--space-6);
`;

const Footer = styled.div`
  padding: var(--space-4) 0;
  font-size: var(--font-size-md);
  color: var(--text-12);
  background-color: var(--component-backgrounds-3);

  ${isMobile} {
    padding: var(--space-3) 0;
  }

  small {
    font-size: var(--font-size-md);
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
    gap: var(--space-2);
    justify-content: unset;
  }
`;

const List = styled.ul`
  display: inline-flex;
  gap: var(--space-2);
  align-items: center;
  justify-content: center;
`;

const ListItem = styled.li`
  display: inline-flex;
  justify-content: center;

  ${isMobile} {
    width: calc(100% / ${Links.length});
  }
`;

const Anchor = styled(_Anchor)`
  ${LinkStyle}

  display: flex;
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-md);
  text-align: center;

  ${isMobile} {
    padding: var(--space-2) var(--space-3);
  }
`;
