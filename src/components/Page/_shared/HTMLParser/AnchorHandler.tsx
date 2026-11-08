import { type DOMNode, domToReact } from 'html-react-parser';
import Link from 'next/link';
import { toSafeProps } from './attribs';
import type { Replacer } from './types';

export const handleAnchor: Replacer = (domNode, options) => {
  const href = domNode.attribs?.href;

  if (domNode.tagName !== 'a' || !href?.startsWith('/')) {
    return undefined;
  }

  return (
    <Link {...toSafeProps(domNode)} href={href}>
      {domToReact(domNode.children as DOMNode[], options)}
    </Link>
  );
};
