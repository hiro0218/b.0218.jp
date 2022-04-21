import { css } from '@/ui/styled';
import { styled } from '@/ui/styled';

type Props = {
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
  textSide?: string;
  textSub?: string;
  isWeightNormal?: boolean;
};

const Heading = ({ tagName: Tag = 'h1', text, textSide, textSub, isWeightNormal = true }: Props) => {
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
  align-items: flex-end;
  justify-content: space-between;
`

const HeaderMainTitle = styled.h1<{ weight: boolean }>`
  color: var(--text-12);
  font-weight: 500;
  line-height: 1.618034;
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
  line-height: 1.41421;
  overflow-wrap: break-word;
`
