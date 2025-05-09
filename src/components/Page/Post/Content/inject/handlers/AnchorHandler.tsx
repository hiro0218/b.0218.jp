import { type DOMNode, domToReact, type Element } from 'html-react-parser';
import { Anchor } from '@/components/UI/Anchor';
import type { HandlerFunction } from '../types';

/**
 * 内部リンク（アンカー）のハンドラー
 * 先頭が「/」で始まるhref属性を持つaタグをAnchorコンポーネントに変換する
 * @param domNode - 処理対象のDOMノード
 * @returns Anchorコンポーネントまたはundefined
 */
export const handleAnchor: HandlerFunction = (domNode: Element) => {
  // aタグでhrefが「/」から始まる場合のみ処理する
  if (domNode.tagName === 'a' && domNode.attribs?.href?.startsWith('/')) {
    return <Anchor href={domNode.attribs.href}>{domToReact(domNode.children as DOMNode[])}</Anchor>;
  }

  return undefined;
};
