import styled from '@emotion/styled';
import { CSSProperties, memo } from 'react';

import { desktop, mobile } from '@/lib/mediaQuery';
import { getModularScale } from '@/lib/modular-scale';

type divProps = JSX.IntrinsicElements['div'];
export interface ContainerProps extends divProps {
  title: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

const Root = styled.section`
  ${desktop} {
    display: flex;
  }
`;

const Col = {
  Title: styled.div`
    ${mobile} {
      margin-bottom: 1rem;
    }

    ${desktop} {
      position: sticky;
      top: calc(var(--header-height) + 0.5rem);
      width: 29.28%;
      height: 100%;
    }
  `,
  Main: styled.div`
    ${desktop} {
      width: 70.72%;
    }
  `,
};

const TitleText = styled.h2`
  overflow: hidden;
  font-size: ${getModularScale({ degree: 2 })};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Columns = memo(function Columns(props: ContainerProps) {
  const { title, children, ...others } = props;

  return (
    <Root className="l-columns" {...others}>
      <Col.Title>
        <TitleText>{title}</TitleText>
      </Col.Title>
      <Col.Main>{children}</Col.Main>
    </Root>
  );
});
