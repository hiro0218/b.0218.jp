import { CSSProperties, memo, ReactNode } from 'react';

import { desktop, mobile } from '@/lib/mediaQuery';
import { css, styled } from '@/ui/styled';

export interface ContainerProps {
  title?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export const Columns = memo(function Columns({ title, children, ...others }: ContainerProps) {
  return (
    <Root className="l-columns" {...others}>
      <ColumnTitle>{title && <TitleText>{title}</TitleText>}</ColumnTitle>
      <ColumnMain>{children}</ColumnMain>
    </Root>
  );
});

const Root = styled.section`
  ${desktop} {
    display: flex;
  }
`;

const TitleText = styled.h2`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ColumnTitle = styled.div`
  ${mobile} {
    margin-bottom: 1rem;
  }

  ${desktop} {
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
  ${desktop} {
    width: 61.8%;
  }
`;
