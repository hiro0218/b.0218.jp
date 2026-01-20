import { type DOMNode, domToReact } from 'html-react-parser';
import { LinkPreview } from '@/components/Page/Post/LinkPreview';
import { safeJsonParse } from '@/lib/utils/json';
import type { HandlerFunction } from './types';

interface LinkPreviewData {
  type: 'link-preview';
  data: {
    link: string;
    card: string;
    thumbnail: string;
    title: string;
    description: string;
    domain: string;
  };
}

/**
 * class="link-preview"を持つ要素をLinkPreviewコンポーネントに変換する
 */
export const handleLinkPreview: HandlerFunction = (domNode) => {
  if (domNode.attribs?.class !== 'link-preview') {
    return undefined;
  }

  const json = safeJsonParse<LinkPreviewData>(domToReact(domNode.children as DOMNode[]) as string);

  if (!json) {
    return undefined;
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
