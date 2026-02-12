import type { NamedExoticComponent, ReactNode } from 'react';

import { css, cx, styled } from '@/ui/styled';
import { fontSizeHeadingClasses, gapClasses } from '@/ui/styled/atomic';
import type { SpaceGap } from '@/ui/styled/theme/tokens/spacing';
import { textEllipsis } from '@/ui/styled/utilities';

type Props = {
  gap?: SpaceGap;
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
  flex-wrap: wrap;
`;

const Title = ({ id, tag = 'h2', children }: TitleProps) => {
  const SidebarHeading = tag;
  return (
    <SidebarHeading
      className={cx(
        textEllipsis,
        fontSizeHeadingClasses.h3,
        css`
          scroll-margin-top: var(--spacing-1);
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
        flex: 7;
        min-inline-size: min(100%, 30rem);
      `}
    >
      {children}
    </div>
  );
};

const stickyStyle = css`
  position: static;
  block-size: 100%;
  isolation: isolate;

  @media (--isDesktop) {
    position: sticky;
    top: var(--spacing-1);
  }
`;

const Side = ({ children }: ChildProps) => {
  return (
    <div
      className={cx(
        css`
          flex: 3;
          min-inline-size: min(100%, 10rem);
        `,
        stickyStyle,
      )}
    >
      {children}
    </div>
  );
};

export const Sidebar = (({ children, gap = 3 }: Props) => {
  return <Container className={gapClasses[gap]}>{children}</Container>;
}) as NamedExoticComponent<Props> & {
  // biome-ignore lint/style/useNamingConvention: compound component pattern requires PascalCase
  Title: typeof Title;
  // biome-ignore lint/style/useNamingConvention: compound component pattern requires PascalCase
  Main: typeof Main;
  // biome-ignore lint/style/useNamingConvention: compound component pattern requires PascalCase
  Side: typeof Side;
};

/**
 * Used with the sidebar
 */
Sidebar.Title = Title;
Sidebar.Main = Main;
Sidebar.Side = Side;
