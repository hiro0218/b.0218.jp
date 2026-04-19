import { type DOMNode, domToReact } from 'html-react-parser';
import { Anchor } from '@/components/UI/Anchor';
import { toSafeProps } from './attribs';
import type { HandlerFunction } from './types';

/**
 * 先頭が「/」で始まるhref属性を持つaタグをAnchorコンポーネントに変換する
 */
export const handleAnchor: HandlerFunction = (domNode, options) => {
  const href = domNode.attribs?.href;

  if (domNode.tagName !== 'a' || !href?.startsWith('/')) {
    return undefined;
  }

  return (
    <Anchor {...toSafeProps(domNode)} href={href}>
      {domToReact(domNode.children as DOMNode[], options)}
    </Anchor>
  );
};
