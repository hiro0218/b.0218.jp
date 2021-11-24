import styled from '@emotion/styled';
import React, { CSSProperties, memo } from 'react';

import Heading from '@/components/Heading';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  title: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

const Root = styled.section`
  /* desktop */
  @media (min-width: 960px) {
    display: flex;
  }
`;

const Col = {
  Title: styled.div`
    /* mobile */
    @media (max-width: 959px) {
      margin-bottom: 1rem;
    }

    /* desktop */
    @media (min-width: 960px) {
      position: sticky;
      top: calc(var(--header-height) + 0.5rem);
      width: 29.28%;
      height: 100%;
    }
  `,
  Main: styled.div`
    /* desktop */
    @media (min-width: 960px) {
      width: 70.72%;
    }
  `,
};

export const Columns = memo(function Columns(props: ContainerProps) {
  const { title, children, ...others } = props;

  return (
    <Root className="l-columns" {...others}>
      <Col.Title>
        <Heading tagName={'h2'} text={title} isWeightNormal={true} />
      </Col.Title>
      <Col.Main>{children}</Col.Main>
    </Root>
  );
});
