import type { Element } from 'hast';
import { Transformer } from 'unified';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import type { Visitor } from 'unist-util-visit/complex-types';

const remark0218 = (): Transformer => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const visitor: Visitor<Element> = (node, index, parent) => {
    if (node.tagName === 'img') {
      node.properties = {
        ...(node.properties || {}),
        loading: 'lazy',
      };

      return;
    }

    if (
      node.tagName === 'code' &&
      Array.isArray(node.properties?.className) &&
      node.properties.className.includes('hljs')
    ) {
      const className = node.properties?.className.join(' ').replace('hljs language-', '');
      node.properties.dataLanguage = className;

      return;
    }
  };

  return (tree: Node) => visit(tree, 'element', visitor);
};

export default remark0218;
