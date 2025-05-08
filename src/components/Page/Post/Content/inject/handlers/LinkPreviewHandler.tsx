import { type DOMNode, domToReact } from 'html-react-parser';
import { LinkPreview } from '@/components/Page/Post/LinkPreview';
import { parseJSON } from '@/lib/parseJSON';
import type { HandlerFunction, LinkPreviewDataProps } from '../types';

/**
 * リンクプレビューのハンドラー
 * class="link-preview"を持つ要素をLinkPreviewコンポーネントに変換する
 * @param domNode - 処理対象のDOMノード
 * @returns LinkPreviewコンポーネントまたはundefined
 */
export const handleLinkPreview: HandlerFunction = (domNode) => {
  // class="link-preview"の要素を処理する
  if (domNode.attribs?.class === 'link-preview') {
    const json = parseJSON<LinkPreviewDataProps>(domToReact(domNode.children as DOMNode[]) as string);

    return (
      <LinkPreview
        link={json.data.link}
        card={json.data.card}
        thumbnail={json.data.thumbnail}
        title={json.data.title}
        description={json.data.description}
        domain={json.data.domain}
      />
    );
  }

  return undefined;
};
