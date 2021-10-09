import { FC } from 'react';

type Props = (
  | JSX.IntrinsicElements['h1']
  | JSX.IntrinsicElements['h2']
  | JSX.IntrinsicElements['h3']
  | JSX.IntrinsicElements['h4']
  | JSX.IntrinsicElements['h5']
  | JSX.IntrinsicElements['h6']
) & {
  tagName?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  text?: string;
  textSide?: string;
  textSub?: string;
  isWeightNormal?: boolean;
};

const Heading: FC<Props> = ({ tagName: Tag = 'h1', text, textSide, textSub, isWeightNormal = false }) => {
  return (
    <>
      <div className="c-heading-main">
        <Tag className={!isWeightNormal ? 'c-heading-main__title' : 'c-heading-main__title--normal'}>{text}</Tag>
        {textSide && <div className="c-heading-main__side">{textSide}</div>}
      </div>
      {textSub && <div className="c-heading-sub">{textSub}</div>}
    </>
  );
};

export default Heading;
