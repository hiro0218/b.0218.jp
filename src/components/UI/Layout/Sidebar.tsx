import type { NamedExoticComponent, ReactNode } from 'react';

import { css, cx, styled } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/tokens/spacing';
import { textEllipsis } from '@/ui/styled/utilities';

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
  /** https://ja.wikipedia.org/wiki/21:9%E3%82%A2%E3%82%B9%E3%83%9A%E3%82%AF%E3%83%88%E6%AF%94 */
  --aspect-ratio: calc(21 / 9); /* 21:9 の比率 */
  --column-ratio: calc(21 / (21 + 9)); /* 片方のカラムの割合 */

  display: flex;

  @media (--isMobile) {
    flex-direction: column;
  }
`;

const Title = ({ id, tag = 'h2', children }: TitleProps) => {
  const SidebarHeading = tag;
  return (
    <SidebarHeading
      className={cx(
        textEllipsis,
        css`
          scroll-margin-top: var(--spacing-1);
        `,
      )}
      data-font-size-h="3"
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
        flex: var(--column-ratio);
        min-width: calc(100% * var(--column-ratio));
      `}
    >
      {children}
    </div>
  );
};

const stickyStyle = css`
  position: sticky;
  top: var(--spacing-1);
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
          flex: calc(1 - var(--column-ratio));
          min-width: calc(100% * (1 - var(--column-ratio)));
        `,
        stickyStyle,
      )}
    >
      {children}
    </div>
  );
};

export const Sidebar = (({ children, space = 3 }: Props) => {
  return <Container data-gap={space}>{children}</Container>;
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
