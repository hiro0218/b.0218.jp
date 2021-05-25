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
  isWeightNormal?: boolean;
  descriptionText?: string;
};

const Heading = ({ tagName: Tag = 'h1', text, isWeightNormal = false, descriptionText }: Props) => {
  return (
    <>
      <Tag className={!isWeightNormal ? 'c-heading' : 'c-heading--normal'}>{text}</Tag>
      {descriptionText && <div className="c-heading-sub">{descriptionText}</div>}
    </>
  );
};

export default Heading;
