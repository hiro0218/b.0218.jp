import { type CSSProperties, memo, type ReactNode } from 'react';

import { SPACING_BASE_PX } from '@/components/Functional/CssBaseline/Settings/Space';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { styled } from '@/ui/styled';

interface ContainerProps {
  title?: string;
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  style?: CSSProperties;
  children?: ReactNode;
}

const Columns = memo(function Columns({ title, titleTagName = 'h2', children, ...others }: ContainerProps) {
  return (
    <Root {...others}>
      <ColumnTitle>{!!title && <TitleText as={titleTagName}>{title}</TitleText>}</ColumnTitle>
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
    margin-top: var(--space-5);
  }
`;

const TitleText = styled.h2`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ColumnTitle = styled.div`
  ${isMobile} {
    margin-bottom: var(--space-2);
  }

  ${isDesktop} {
    position: sticky;
    width: 38.2%;
    height: 100%;

    && {
      top: calc(${SPACING_BASE_PX * 5}px + 1rem);
    }
  }
`;

const ColumnMain = styled.div`
  ${isDesktop} {
    width: 61.8%;
  }
`;
