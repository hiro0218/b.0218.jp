import { type DOMNode, domToReact } from 'html-react-parser';
import { LinkPreview } from '@/components/Page/Post/LinkPreview';
import { parseJSON } from '@/lib/utils/parseJSON';
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
  if (domNode.attribs?.class === 'link-preview') {
    const json = parseJSON<LinkPreviewData>(domToReact(domNode.children as DOMNode[]) as string);

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
  }

  return undefined;
};
