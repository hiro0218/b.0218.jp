import type { ReactNode } from 'react';
import { type CSSProperties, useMemo } from 'react';

import { css, styled } from '@/ui/styled/static';

type Props = {
  id?: HTMLHeadingElement['id'];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
  textSide?: ReactNode;
  textSub?: ReactNode;
  isWeightNormal?: boolean;
};

function Heading({
  id = undefined,
  as: TitleTag = 'h1',
  children,
  textSide = undefined,
  textSub = undefined,
  isWeightNormal = true,
}: Props) {
  const titleStyle = {
    ...(!isWeightNormal && { '--font-weight': 'var(--font-weight-bold)' }),
  } as CSSProperties;

  const fontSizeLevel = (() => {
    switch (TitleTag) {
      case 'h1':
      case 'h2':
        return 4;
      default:
        return 5;
    }
  })();

  const TitleComponent = useMemo(
    () => (
      <TitleTag className={headerTitleStyle} data-font-size-h={fontSizeLevel} id={id} style={titleStyle}>
        {children}
      </TitleTag>
    ),
    [TitleTag, children, id, fontSizeLevel, titleStyle],
  );

  const hasTextSub = !!textSub;
  const hasTextSide = !!textSide;

  return (
    <>
      {hasTextSub || hasTextSide ? (
        <Container>
          <Main>
            {TitleComponent}
            {hasTextSub && <HeaderSub>{textSub}</HeaderSub>}
          </Main>
          {hasTextSide && <Side>{textSide}</Side>}
        </Container>
      ) : (
        <>{TitleComponent}</>
      )}
    </>
  );
}

export default Heading;

const Container = styled.hgroup`
  display: flex;
  align-items: center;
`;

const Main = styled.div`
  flex: 1 1;
`;

const headerTitleStyle = css`
  font-weight: var(--font-weight, --font-weight-normal);
  line-height: var(--line-height-sm);
  color: var(--color-gray-12);
  overflow-wrap: break-word;
`;

const Side = styled.div`
  color: var(--color-gray-11);
`;

const HeaderSub = styled.div`
  margin-top: var(--space-1);
  font-weight: var(--font-weight-normal);
  color: var(--color-gray-11);
  overflow-wrap: break-word;
`;
