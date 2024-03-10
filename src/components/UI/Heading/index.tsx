import type { ReactNode } from 'react';
import { useMemo } from 'react';

import { styled } from '@/ui/styled';

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
  const TitleComponent = useMemo(
    () => (
      <HeaderTitle id={id} level={as} weight={isWeightNormal}>
        {text}
      </HeaderTitle>
    ),
    [as, isWeightNormal, id, text],
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

const HeaderTitle = styled.h1<{ weight: boolean; level: Props['as'] }>`
  font-size: ${({ level }) => {
    return level === 'h1' || level === 'h2' || level === 'h3' ? 'var(--font-size-h4)' : 'var(--font-size-h5)';
  }};
  font-weight: ${({ weight }) => (weight ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)')};
  color: var(--text-12);
  overflow-wrap: break-word;
`;

const Side = styled.div`
  color: var(--text-11);
`;

const HeaderSub = styled.div`
  margin-top: var(--space-1);
  font-weight: var(--font-weight-normal);
  color: var(--text-11);
  overflow-wrap: break-word;
`;
