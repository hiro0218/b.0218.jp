import { memo, type ReactNode } from 'react';

import { SPACING_BASE_PX } from '@/components/Functional/CssBaseline/Settings/Space';
import { isDesktop, isMobile } from '@/ui/lib/mediaQuery';
import { textEllipsis } from '@/ui/mixin';
import { styled } from '@/ui/styled';

interface ContainerProps {
  title: string;
  titleTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
}

export const Columns = memo(function Columns({ title, titleTagName = 'h2', children, ...others }: ContainerProps) {
  return (
    <Root {...others}>
      <ColumnTitle>
        <TitleText as={titleTagName} id={title}>
          {title}
        </TitleText>
      </ColumnTitle>
      <ColumnMain>{children}</ColumnMain>
    </Root>
  );
});

const Root = styled.section`
  display: flex;
  gap: var(--space-2);

  ${isMobile} {
    flex-direction: column;
  }

  & + & {
    margin-block-start: var(--space-5);
  }
`;

const TitleText = styled.h2`
  ${textEllipsis}
`;

const ColumnTitle = styled.div`
  ${isDesktop} {
    position: sticky;
    inset-block-start: calc(${SPACING_BASE_PX * 5}px + 1rem);
    inline-size: 38.2%;
    block-size: 100%;
  }
`;

const ColumnMain = styled.div`
  ${isDesktop} {
    inline-size: 61.8%;
  }
`;
