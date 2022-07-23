import type { Element } from 'hast';
import { Transformer } from 'unified';
import { Node } from 'unist';
import { visit } from 'unist-util-visit';
import type { Visitor } from 'unist-util-visit/complex-types';

const transformImage = (node: Element) => {
  node.properties = {
    ...(node.properties || {}),
    loading: 'lazy',
  };
};

const transformCodeblock = (node: Element) => {
  if (Array.isArray(node.properties?.className) && node.properties.className.includes('hljs')) {
    const className = node.properties?.className.join(' ').replace('hljs language-', '');
    node.properties.dataLanguage = className;
  }
};

const remark0218 = (): Transformer => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const visitor: Visitor<Element> = (node, index, parent) => {
    switch (node.tagName) {
      case 'img':
        transformImage(node);
        break;
      case 'code':
        transformCodeblock(node);
        break;
    }
  };

  return (tree: Node) => visit(tree, 'element', visitor);
};

export default remark0218;
