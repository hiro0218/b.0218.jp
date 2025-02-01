type Props = {
  link: string;
  card: string;
  thumbnail: string;
  title: string;
  description: string;
  domain: string;
};

export const LinkPreview = ({ link, card, thumbnail, title, domain, description }: Props) => {
  return (
    <a href={link} target="_blank" className="p-link-preview" data-card={card}>
      <span className="p-link-preview-body">
        <span className="p-link-preview-body__title">{title}</span>
        <span className="p-link-preview-body__description">{description}</span>
        <span className="p-link-preview-body__url">{domain}</span>
      </span>
      <span className="p-link-preview-thumbnail">
        <img src={thumbnail} alt="" loading="lazy" decoding="async" />
      </span>
    </a>
  );
};
