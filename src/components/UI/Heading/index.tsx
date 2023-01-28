import { ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: ReactNode;
  textSide?: ReactNode;
  textSub?: ReactNode;
  isWeightNormal?: boolean;
};

const Heading = ({ as = 'h1', text, textSide, textSub, isWeightNormal = true }: Props) => {
  return (
    <Container>
      <Main>
        <HeaderTitle as={as} weight={isWeightNormal}>
          {text}
        </HeaderTitle>
        {textSub && <HeaderSub>{textSub}</HeaderSub>}
      </Main>
      {textSide && <Side>{textSide}</Side>}
    </Container>
  );
};

export default Heading;

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 1 1;
`;

const HeaderTitle = styled.h1<{ weight: boolean }>`
  color: var(--text-12);
  font-weight: ${({ weight }) => (weight ? 'var(--font-weight-bold)' : 'var(--font-weight-normal)')};
  line-height: 1.618034;
  overflow-wrap: break-word;
`;

const Side = styled.div`
  margin-top: auto;
  color: var(--text-11);
`;

const HeaderSub = styled.div`
  margin-top: var(--space-1);
  color: var(--text-11);
  font-weight: var(--font-weight-normal);
  line-height: 1.41421;
  overflow-wrap: break-word;
`;
