import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { css, styled } from '@/ui/styled/static';

type Props = {
  id?: HTMLHeadingElement['id'];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: ReactNode;
  textSide?: ReactNode;
  textSub?: ReactNode;
  isWeightNormal?: boolean;
};

function Heading({
  id = undefined,
  as = 'h1',
  text = undefined,
  textSide = undefined,
  textSub = undefined,
  isWeightNormal = true,
}: Props) {
  const TitleTag = as;
  const TitleComponent = useMemo(
    () => (
      <TitleTag
        id={id}
        className={headerTitleStyle}
        style={{
          // @ts-ignore CSS Custom Properties
          '--font-size': TitleTag === 'h1' || TitleTag === 'h2' ? 'var(--font-size-h4)' : 'var(--font-size-h5)',
          ...(!isWeightNormal && { '--font-weight': 'var(--font-weight-bold)' }),
        }}
      >
        {text}
      </TitleTag>
    ),
    [isWeightNormal, id, text],
  );
  return (
    <>
      {!!textSub || !!textSide ? (
        <Container>
          <Main>
            {TitleComponent}
            {!!textSub && <HeaderSub>{textSub}</HeaderSub>}
          </Main>
          {!!textSide && <Side>{textSide}</Side>}
        </Container>
      ) : (
        <>{TitleComponent}</>
      )}
    </>
  );
}

export default Heading;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Main = styled.div`
  flex: 1 1;
`;

const headerTitleStyle = css`
  font-size: var(--font-size);
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
