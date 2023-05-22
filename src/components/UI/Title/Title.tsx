import type { ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  headingTagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  heading: string;
  paragraph?: ReactNode;
  sideElement?: ReactNode;
  children?: ReactNode;
};

export const Title = ({ headingTagName: Tag = 'h1', heading, paragraph, sideElement, children }: Props) => (
  <>
    <Container>
      <Main>
        <HeaderTitle as={Tag} dangerouslySetInnerHTML={{ __html: heading }}></HeaderTitle>
        {!!paragraph && <P>{paragraph}</P>}
      </Main>
      {!!sideElement && <Side>{sideElement}</Side>}
    </Container>
    {children}
  </>
);

const Container = styled.header`
  display: flex;
  overflow-wrap: break-word;
`;

const Main = styled.div`
  flex: 1 1;
`;

const HeaderTitle = styled.h1`
  font-weight: var(--font-weight-bolder);
`;

const P = styled.p`
  margin-top: var(--space-1);
  font-size: var(--font-size-md);
  color: var(--text-11);
`;

const Side = styled.div`
  margin-top: auto;
  color: var(--text-11);
`;
