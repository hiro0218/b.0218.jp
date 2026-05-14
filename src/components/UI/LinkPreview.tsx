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
    <Anchor data-card={card} href={link} target="_blank">
      <Body>
        <BodyTitle className={textEllipsis}>{decodedTitle}</BodyTitle>
        {description ? <BodyDescription data-line-clamp="1">{description}</BodyDescription> : null}
        <BodyUrl className={textEllipsis}>{domain}</BodyUrl>
      </Body>
      {thumbnail ? (
        <Thumbnail>
          {/* biome-ignore lint/performance/noImgElement: 任意 URL のOGPサムネイルを最適化設定に依存せず表示する */}
          <img alt="" decoding="async" height="120" loading="lazy" src={thumbnail} width="120" />
        </Thumbnail>
      ) : null}
    </Anchor>
  );
};

const Anchor = styled.a`
  --link-preview-thumbnail-size: 120px;

  display: flex;
  align-items: center;
  height: var(--link-preview-thumbnail-size);
  margin: var(--spacing-3) 0;
  container-type: inline-size;
  overflow: hidden;
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

  &[target='_blank']::after {
    content: none;
  }

  &[data-card='summary_large_image'] {
    @container (min-width: 500px) {
      .p-link-preview-body {
        padding: var(--spacing-2);
      }

      .p-link-preview-thumbnail {
        width: calc(var(--container-width) / 230px);
        max-width: 230px;
        height: var(--link-preview-thumbnail-size);
      }
    }
  }
`;

const Body = styled.span`
  display: block;
  flex: 1 1;
  width: calc(100% - var(--link-preview-thumbnail-size));
  padding: 0 var(--spacing-2);
  padding-left: var(--spacing-2);
`;

const BodyTitle = styled.span`
  display: block;
  font-size: var(--font-sizes-md);
  font-weight: var(--font-weights-bold);
`;

const BodyDescription = styled.span`
  display: none;
  margin-top: var(--spacing-½);
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-800);

  @container (min-width: 500px) {
    display: block;
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
  width: var(--link-preview-thumbnail-size);
  height: var(--link-preview-thumbnail-size);
  overflow: hidden;
  user-select: none;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
