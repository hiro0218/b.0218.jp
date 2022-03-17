import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { FC } from 'react';

type Props = {
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
  textSide?: string;
  textSub?: string;
  isWeightNormal?: boolean;
};

const Heading: FC<Props> = ({ tagName: Tag = 'h1', text, textSide, textSub, isWeightNormal = true }) => {
  const HeaderTitle = HeaderMainTitle.withComponent(Tag)

  return (
    <>
      <HeaderMain>
        <HeaderTitle weight={isWeightNormal}>
          {text}
        </HeaderTitle>
        {textSide && <HeadingSide>{textSide}</HeadingSide>}
      </HeaderMain>
      {textSub && <HeaderSub>{textSub}</HeaderSub>}
    </>
  );
};

export default Heading;

const HeaderMain = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`

const HeaderMainTitle = styled.h1<{ weight: boolean }>`
  color: var(--text-12);
  font-weight: 500;
  line-height: 1.6;
  overflow-wrap: break-word;

  ${({ weight }) => weight && css`
    font-weight: 900;
  `}
`

const HeadingSide = styled.div`
  color: var(--text-11);
`

const HeaderSub = styled.div`
  color: var(--text-11);
  font-weight: normal;
  line-height: 1.4;
  overflow-wrap: break-word;
`
