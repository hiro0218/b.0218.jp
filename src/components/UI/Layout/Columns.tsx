import { CSSProperties, memo, ReactNode } from 'react';

import { getModularScale } from '@/lib/modular-scale';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { css, styled } from '@/ui/styled';

export interface ContainerProps {
  title?: string;
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  style?: CSSProperties;
  children?: ReactNode;
}

const Columns = memo(function Columns({ title, titleTagName = 'h2', children, ...others }: ContainerProps) {
  return (
    <Root {...others}>
      <ColumnTitle>{title && <TitleText as={titleTagName}>{title}</TitleText>}</ColumnTitle>
      <ColumnMain>{children}</ColumnMain>
    </Root>
  );
});

export default Columns;

const Root = styled.section`
  ${isDesktop} {
    display: flex;
  }

  & + & {
    margin-top: var(--space-xl);
  }
`;

const TitleText = styled.h2`
  overflow: hidden;
  font-size: ${getModularScale({ degree: 2 })};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ColumnTitle = styled.div`
  ${isMobile} {
    margin-bottom: 1rem;
  }

  ${isDesktop} {
    position: sticky;
    width: 38.2%;
    height: 100%;

    ${({ theme }) => css`
      && {
        top: calc(${theme.components.header.height}px + 0.5rem);
      }
    `}
  }
`;

const ColumnMain = styled.div`
  ${isDesktop} {
    width: 61.8%;
  }
`;
