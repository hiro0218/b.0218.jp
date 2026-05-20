import { type DOMNode, domToReact } from 'html-react-parser';
import { LinkPreview } from '@/components/UI/LinkPreview';
import { isObject } from '@/lib/utils/isObject';
import { safeJsonParse } from '@/lib/utils/json';
import type { Replacer } from './types';

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

function isLinkPreviewData(value: unknown): value is LinkPreviewData {
  if (!isObject(value) || value.type !== 'link-preview' || !isObject(value.data)) {
    return false;
  }

  const { link, card, thumbnail, title, description, domain } = value.data;

  return [link, card, thumbnail, title, description, domain].every((item) => typeof item === 'string');
}

/**
 * class="link-preview"を持つ要素をLinkPreviewコンポーネントに変換する
 */
export const handleLinkPreview: Replacer = (domNode) => {
  if (domNode.attribs?.class !== 'link-preview') {
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
