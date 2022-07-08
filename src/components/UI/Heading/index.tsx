import { ReactNode } from 'react';

import { styled } from '@/ui/styled';

type Props = {
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: ReactNode;
  textSide?: ReactNode;
  textSub?: ReactNode;
  isWeightNormal?: boolean;
};

const Heading = ({ tagName: Tag = 'h1', text, textSide, textSub, isWeightNormal = true }: Props) => {
  const HeaderTitle = HeaderMainTitle.withComponent(Tag);

  return (
    <>
      <HeaderMain>
        <HeaderTitle weight={isWeightNormal}>{text}</HeaderTitle>
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
`;

const HeaderMainTitle = styled.h1<{ weight: boolean }>`
  color: var(--text-12);
  font-weight: ${({ weight }) => (weight ? '900' : '500')};
  line-height: 1.618034;
  overflow-wrap: break-word;
`;

const HeadingSide = styled.div`
  color: var(--text-11);
`;

const HeaderSub = styled.div`
  margin-top: var(--space-xs);
  color: var(--text-11);
  font-weight: normal;
  line-height: 1.41421;
  overflow-wrap: break-word;
`;
