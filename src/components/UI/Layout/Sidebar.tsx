import type { NamedExoticComponent, ReactNode } from 'react';

import { css, cx, styled } from '@/ui/styled/static';
import type { SpaceGap } from '@/ui/styled/variables/space';

type Props = {
  space?: SpaceGap;
  children: ReactNode;
};

type ChildProps = {
  children: ReactNode;
};

type TitleProps = {
  id?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
};

const Container = styled.div`
  display: flex;
  gap: var(--space);

  @media (--isMobile) {
    flex-direction: column;
  }
`;

const Title = ({ id, tag = 'h2', children }: TitleProps) => {
  const SidebarHeading = tag;
  return (
    <SidebarHeading
      className={cx(
        'text-ellipsis',
        css`
          font-size: var(--font-size-h3);
        `,
      )}
      id={id}
    >
      {children}
    </SidebarHeading>
  );
};

const Main = ({ children }: ChildProps) => {
  return (
    <div
      className={css`
        flex: 1.618;
        min-width: 61.8%;
      `}
    >
      {children}
    </div>
  );
};

const stickyStyle = css`
  position: sticky;
  top: var(--space-1);
  block-size: 100%;
  isolation: isolate;

  @media (--isMobile) {
    position: static;
  }
`;

const Side = ({ children }: ChildProps) => {
  return (
    <div
      className={cx(
        css`
          flex: 1;
        `,
        stickyStyle,
      )}
    >
      {children}
    </div>
  );
};

export const Sidebar = (({ children, space = 3 }: Props) => {
  return (
    <Container
      style={{
        // @ts-ignore CSS Custom Property
        '--space': `var(--space-${space})`,
      }}
    >
      {children}
    </Container>
  );
}) as NamedExoticComponent<Props> & {
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Title: typeof Title;
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Main: typeof Main;
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Side: typeof Side;
};

/**
 * Used with the sidebar
 */
Sidebar.Title = Title;
Sidebar.Main = Main;
Sidebar.Side = Side;
