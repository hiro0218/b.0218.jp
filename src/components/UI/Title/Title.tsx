import { ReactNode } from 'react';

import { getModularScale } from '@/lib/modular-scale';
import { styled } from '@/ui/styled';

type Props = {
  headingTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  heading: string;
  paragraph?: ReactNode;
  sideElement?: ReactNode;
  children?: ReactNode;
};

export const Title = ({ headingTagName: Tag = 'h1', heading, paragraph, sideElement, children }: Props) => (
  <div>
    <Container>
      <Main>
        <HeaderTitle as={Tag}>{heading}</HeaderTitle>
        {paragraph && <P>{paragraph}</P>}
      </Main>
      {sideElement && <Side>{sideElement}</Side>}
    </Container>
    {children}
  </div>
);

const Container = styled.header`
  display: flex;
`;

const Main = styled.div`
  flex: 1 1;
`;

const HeaderTitle = styled.h1`
  font-size: ${getModularScale({ degree: 4 })};
  line-height: 1.618034;
  overflow-wrap: break-word;
`;

const P = styled.p`
  margin-top: var(--space-xs);
  color: var(--text-11);
  font-size: var(--font-size-lg);
  font-weight: normal;
  overflow-wrap: break-word;
`;

const Side = styled.div`
  margin-top: auto;
  color: var(--text-11);
`;
