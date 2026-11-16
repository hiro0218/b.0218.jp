import { styled } from '@/ui/styled';
import { textEllipsis } from '@/ui/styled/utilities/text-ellipsis';

type Props = {
  link: string;
  card: string;
  thumbnail: string;
  title: string;
  description: string;
  domain: string;
};

/**
 * @summary 外部リンクのカード型プレビュー
 */
export const LinkPreview = ({ link, card, thumbnail, title, domain, description }: Props) => {
  const decodedTitle = title.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
  return (
    // a 要素と data-card を、本文 CSS（post-content/index.css）と別に変えない。CSS が a[data-card] で選ぶため
    <Anchor data-card={card} href={link} target="_blank">
      <Body className="p-link-preview-body">
        <BodyTitle className={textEllipsis}>{decodedTitle}</BodyTitle>
        {description ? <BodyDescription data-line-clamp="1">{description}</BodyDescription> : null}
        <BodyUrl className={textEllipsis}>{domain}</BodyUrl>
      </Body>
      {thumbnail ? (
        <Thumbnail className="p-link-preview-thumbnail">
          <img alt="" decoding="async" height="120" loading="lazy" src={thumbnail} width="120" />
        </Thumbnail>
      ) : null}
    </Anchor>
  );
};

const Anchor = styled.a`
  --thumbnail-size: 120px;

  display: flex;
  align-items: center;
  height: var(--thumbnail-size);
  container-type: inline-size;
  overflow: clip;
  color: var(--colors-gray-900);
  text-decoration: none;
  text-decoration-line: unset;
  background-color: var(--colors-white);
  border: var(--border-widths-thin) solid var(--colors-gray-a-300);
  border-radius: var(--radii-md);

  &:hover,
  &:focus-visible {
    background-color: var(--colors-gray-50);
    border-color: var(--colors-gray-a-400);
  }

  &:active {
    background-color: var(--colors-gray-100);
  }

  &[target='_blank']::after {
    content: none;
  }

  &[data-card='summary_large_image'] {
    @container (min-width: 500px) {
      .p-link-preview-body {
        padding: var(--spacing-300);
      }

      .p-link-preview-thumbnail {
        --thumbnail-height: 230px;

        width: min(40%, var(--thumbnail-height));
        max-width: var(--thumbnail-height);
      }
    }
  }
`;

const Body = styled.span`
  display: block;
  flex: 1 1;
  width: calc(100% - var(--thumbnail-size));
  padding: 0 var(--spacing-300);
  padding-left: var(--spacing-300);
`;

const BodyTitle = styled.span`
  display: block;
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
`;

const BodyDescription = styled.span`
  display: none;
  margin-top: var(--spacing-75);
  font-size: var(--font-sizes-sm);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-700);

  @container (min-width: 500px) {
    display: block;
  }
`;

const BodyUrl = styled.span`
  display: block;
  margin-top: var(--spacing-100);
  font-size: var(--font-sizes-xs);
  line-height: var(--grid-line-height-sm);
  color: var(--colors-gray-700);
`;

const Thumbnail = styled.span`
  display: flex;
  flex-shrink: 0;
  flex-basis: auto;
  flex-direction: column;
  width: var(--thumbnail-size);
  height: stretch;
  height: var(--thumbnail-size);
  overflow: clip;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
