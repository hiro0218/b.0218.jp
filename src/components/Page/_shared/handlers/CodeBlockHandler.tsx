import { type DOMNode, domToReact } from 'html-react-parser';
import { CodeBlock } from '@/components/UI/CodeBlock';
import { toSafeProps } from './attribs';
import type { Replacer } from './types';

/**
 * <pre> 要素を CodeBlock コンポーネントに変換し、Copy code 操作を併設する。
 */
export const handleCodeBlock: Replacer = (domNode, options) => {
  if (domNode.name !== 'pre') {
    return undefined;
  }

  const preProps = toSafeProps(domNode);
  const children = domToReact(domNode.children as DOMNode[], options);

  return <CodeBlock preProps={preProps}>{children}</CodeBlock>;
};
