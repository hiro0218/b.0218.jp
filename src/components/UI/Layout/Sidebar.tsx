import type { CSSProperties, NamedExoticComponent, ReactNode } from 'react';

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
  /** https://ja.wikipedia.org/wiki/21:9%E3%82%A2%E3%82%B9%E3%83%9A%E3%82%AF%E3%83%88%E6%AF%94 */
  --aspect-ratio: calc(21 / 9); /* 21:9 の比率 */
  --column-ratio: calc(21 / (21 + 9)); /* 片方のカラムの割合 */

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
          scroll-margin-top: var(--space-1);
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
  return (
    <Container
      style={
        {
          '--space': `var(--space-${space})`,
        } as CSSProperties
      }
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
