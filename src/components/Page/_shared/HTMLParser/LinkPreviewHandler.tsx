import { type DOMNode, domToReact } from 'html-react-parser';
import { LinkPreview } from '@/components/UI/LinkPreview';
import { isLinkPreviewData, LINK_PREVIEW_CLASS_NAME, type LinkPreviewData } from '@/lib/domain/embeddedContent';
import { safeJsonParse } from '@/lib/utils/json';
import type { Replacer } from './types';

/**
 * class="link-preview"を持つ要素をLinkPreviewコンポーネントに変換する
 */
export const handleLinkPreview: Replacer = (domNode) => {
  if (domNode.attribs?.class !== LINK_PREVIEW_CLASS_NAME) {
    return undefined;
  }

  const json = safeJsonParse<LinkPreviewData>(domToReact(domNode.children as DOMNode[]) as string);

  if (!isLinkPreviewData(json)) {
    // biome-ignore lint/complexity/noUselessFragments: 不正な placeholder を DOM に残さず空に置換する
    return <></>;
  }

  return (
    <LinkPreview
      card={json.data.card}
      description={json.data.description}
      domain={json.data.domain}
      link={json.data.link}
      thumbnail={json.data.thumbnail}
      title={json.data.title}
    />
  );
};
