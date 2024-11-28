import type { NamedExoticComponent, ReactNode } from 'react';
import { Children, Fragment } from 'react';

import { textEllipsis } from '@/ui/mixin';
import { css, styled } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/CssBaseline/Settings/Space';

type Props = {
  space?: SpaceGap;
  isMainColumnLast?: boolean;
  children: ReactNode;
};

type TitleProps = {
  id?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
};

const calculateWidthsInPercent = () => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const main = (1 / phi) * 100;
  const side = 100 - main;

  return {
    mainWidth: main,
    sideWidth: side,
  };
};
const { mainWidth, sideWidth } = calculateWidthsInPercent();

const Container = styled.div<Props>`
  --space: ${({ space = 2 }) => `var(--space-${space})`};
  --side-width: ${sideWidth}%;
  --content-min: ${mainWidth}%;

  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-bottom: calc(var(--space-2) / 2);
  overflow: clip;

  & > * {
    flex-grow: 1;
    flex-basis: var(--side-width);
    min-width: var(--side-width);

    ${({ isMainColumnLast = true }) => {
      const selector = isMainColumnLast ? '&:last-child' : '&:first-child';
      return css`
        ${selector} {
          flex-grow: 999;
          flex-basis: 0;
          min-width: calc(var(--content-min) - var(--space));
        }
      `;
    }}
  }
`;

const Title = ({ id, tag = 'h2', children }: TitleProps) => {
  return (
    <StickyContainer>
      <SidebarHeading as={tag} id={id}>
        {children}
      </SidebarHeading>
    </StickyContainer>
  );
};

export const Sidebar = (({ children, space, isMainColumnLast }: Props) => {
  return (
    <Container space={space} isMainColumnLast={isMainColumnLast}>
      {Children.toArray(children).map((child, i) => {
        return <Fragment key={i}>{child}</Fragment>;
      })}
    </Container>
  );
}) as NamedExoticComponent<Props> & {
  // biome-ignore lint/style/useNamingConvention: <explanation>
  Title: typeof Title;
};

const StickyContainer = styled.div`
  position: sticky;
  top: 0;
  block-size: 100%;
`;

const SidebarHeading = styled.h2<Props>`
  ${textEllipsis}

  font-size: var(--font-size-h3);
`;

/**
 * Used with the sidebar
 */
Sidebar.Title = Title;
