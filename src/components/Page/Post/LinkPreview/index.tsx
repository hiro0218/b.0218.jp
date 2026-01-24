import { styled } from '@/ui/styled';
import { textEllipsis } from '@/ui/styled/utilities';

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
        <BodyTitle className={textEllipsis}>{decodedTitle}</BodyTitle>
        {description && <BodyDescription data-line-clamp="1">{description}</BodyDescription>}
        <BodyUrl className={textEllipsis}>{domain}</BodyUrl>
      </Body>
      {thumbnail && (
        <Thumbnail>
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
  margin: var(--spacing-3) 0;
  overflow: hidden;
  color: var(--colors-gray-900);
  text-decoration: none;
  text-decoration-line: unset;
  background-color: var(--colors-white);
  border: 1px solid var(--colors-gray-a-300);
  border-radius: var(--radii-8);

  &:hover {
    background-color: var(--colors-gray-50);
    border-color: var(--colors-gray-a-400);
  }

  &[target='_blank']::after {
    content: none;
  }

  &[data-card='summary_large_image'] {
    @media (--isDesktop) {
      .p-link-preview-body {
        padding: var(--spacing-2);
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
  padding: 0 var(--spacing-2);
  padding-left: var(--spacing-2);
`;

const BodyTitle = styled.span`
  display: block;
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
`;

const BodyDescription = styled.span`
  margin-top: var(--spacing-½);
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-800);

  @media (--isMobile) {
    display: none;
  }
`;

const BodyUrl = styled.span`
  display: block;
  font-size: var(--font-sizes-xs);
  color: var(--colors-gray-600);
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
