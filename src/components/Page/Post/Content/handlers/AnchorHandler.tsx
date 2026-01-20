import { type DOMNode, domToReact } from 'html-react-parser';
import { Anchor } from '@/components/UI/Anchor';
import type { HandlerFunction } from './types';

/**
 * 先頭が「/」で始まるhref属性を持つaタグをAnchorコンポーネントに変換する
 */
export const handleAnchor: HandlerFunction = (domNode, options) => {
  if (domNode.tagName !== 'a' || !domNode.attribs?.href?.startsWith('/')) {
    return undefined;
  }

  return <Anchor href={domNode.attribs.href}>{domToReact(domNode.children as DOMNode[], options)}</Anchor>;
};
