import { styled } from '@/ui/styled/static';

type Props = {
  link: string;
  card: string;
  thumbnail: string;
  title: string;
  description: string;
  domain: string;
};

export const LinkPreview = ({ link, card, thumbnail, title, domain, description }: Props) => {
  const decodedTitle = title.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
  return (
    <Anchor data-card={card} href={link} target="_blank">
      <Body>
        <BodyTitle className="text-ellipsis">{decodedTitle}</BodyTitle>
        {description && <BodyDescription data-line-clamp="1">{description}</BodyDescription>}
        <BodyUrl className="text-ellipsis">{domain}</BodyUrl>
      </Body>
      {thumbnail && (
        <Thumbnail>
          {/** biome-ignore lint/nursery/noImgElement: use raw img */}
          <img alt="" decoding="async" height="120" loading="lazy" src={thumbnail} width="120" />
        </Thumbnail>
      )}
    </Anchor>
  );
};

const Anchor = styled.a`
  display: flex;
  align-items: center;
  height: 120px;
  margin: var(--space-3) 0;
  overflow: hidden;
  color: var(--color-gray-12);
  text-decoration: none;
  text-decoration-line: unset;
  background-color: var(--white);
  border: 1px solid var(--color-gray-7);
  border-radius: var(--border-radius-8);

  &:hover {
    background-color: var(--color-gray-2);
    border-color: var(--color-gray-8);
  }

  &[target='_blank']::after {
    content: none;
  }

  &[data-card='summary_large_image'] {
    @media (--isDesktop) {
      .p-link-preview-body {
        padding: var(--space-2);
      }

      .p-link-preview-thumbnail {
        width: calc(var(--container-width) / 230px);
        max-width: 230px;
        height: 120px;
      }
    }
  }
`;

const Body = styled.span`
  display: block;
  flex: 1 1;
  width: calc(100% - 120px);
  padding: 0 var(--space-2);
  padding-left: var(--space-2);
`;

const BodyTitle = styled.span`
  display: block;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
`;

const BodyDescription = styled.span`
  margin-top: var(--space-½);
  font-size: var(--font-size-sm);
  color: var(--color-gray-11);

  @media (--isMobile) {
    display: none;
  }
`;

const BodyUrl = styled.span`
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-gray-11);
`;

const Thumbnail = styled.span`
  display: flex;
  flex-shrink: 0;
  flex-basis: auto;
  flex-direction: column;
  width: 120px;
  height: 120px;
  overflow: hidden;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
