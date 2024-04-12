import type { ReactNode } from 'react';
import { Children } from 'react';

import { textEllipsis } from '@/ui/mixin';
import { styled } from '@/ui/styled';
import type { SpaceGap } from '@/ui/styled/CssBaseline/Settings/Space';

type Props = {
  space?: SpaceGap;
  children: ReactNode;
};

type TitleProps = {
  id?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
};

const Container = styled.div<Props>`
  --space: ${({ space = 2 }) => `var(--space-${space})`};
  --side-width: 15rem;
  --content-min: 61.8%;

  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  overflow: clip;

  & > * {
    flex-basis: var(--side-width);
    flex-grow: 1;

    &:last-child {
      flex-basis: 0;
      flex-grow: 999;
      min-width: calc(var(--content-min) - var(--space));
    }
  }
`;

export const Sidebar = ({ children, space }: Props) => {
  return (
    <Container space={space}>
      {Children.toArray(children).map((child) => {
        return child;
      })}
    </Container>
  );
};

const SidebarTitleContainer = styled.div`
  position: sticky;
  top: 0;
  block-size: 100%;
`;

const SidebarHeading = styled.h2<Props>`
  ${textEllipsis}
`;

/**
 * Used with the sidebar
 */
Sidebar.title = ({ id, tag = 'h2', children }: TitleProps) => {
  return (
    <SidebarTitleContainer>
      <SidebarHeading as={tag} id={id}>
        {children}
      </SidebarHeading>
    </SidebarTitleContainer>
  );
};
