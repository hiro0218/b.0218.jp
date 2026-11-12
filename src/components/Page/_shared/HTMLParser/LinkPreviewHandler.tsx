import { type DOMNode, domToReact } from 'html-react-parser';
import { LinkPreview } from '@/components/UI/LinkPreview';
import { LINK_PREVIEW_CLASS_NAME, parseLinkPreviewData } from '@/lib/domain/embeddedContent';
import type { Replacer } from './types';

/**
 * class="link-preview"を持つ要素をLinkPreviewコンポーネントに変換する
 */
export const handleLinkPreview: Replacer = (domNode) => {
  if (domNode.attribs?.class !== LINK_PREVIEW_CLASS_NAME) {
    return undefined;
  }

  const linkPreviewData = parseLinkPreviewData(domToReact(domNode.children as DOMNode[]) as string);

  if (!linkPreviewData) {
    // biome-ignore lint/complexity/noUselessFragments: 不正な placeholder を DOM に残さず空に置換する
    return <></>;
  }

  return (
    <LinkPreview
      card={linkPreviewData.data.card}
      description={linkPreviewData.data.description}
      domain={linkPreviewData.data.domain}
      link={linkPreviewData.data.link}
      thumbnail={linkPreviewData.data.thumbnail}
      title={linkPreviewData.data.title}
    />
  );
};
