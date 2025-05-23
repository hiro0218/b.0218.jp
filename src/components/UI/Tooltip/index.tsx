type Props = {
  text: string;
  position?: 'top' | 'bottom';
};

export const Tooltip = ({ text, position = 'bottom' }: Props) => {
  return (
    <span className="tooltip">
      <span className="tooltip__text" dangerouslySetInnerHTML={{ __html: text }} data-position={position} />
    </span>
  );
};
