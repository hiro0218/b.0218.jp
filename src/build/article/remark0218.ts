import type { Element } from 'hast';
import { type Transformer } from 'unified';
import { visit } from 'unist-util-visit';

import transformCodeblock from './transform/codeblock';
import transformImage from './transform/image';
import transformLinkPreview from './transform/linkPreview';
import { removeEmptyParagraph } from './transform/paragraph';

const remark0218 = (): Transformer => {
  const nodes = new Set<{ node: Element; index: number; parent: Element }>();

  return async (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'a') {
        nodes.add({ node, index, parent });
      }

      if (node.tagName === 'img') {
        transformImage(node);
      }

      if (node.tagName === 'code' && node.children.length > 0) {
        transformCodeblock(node);
      }

      if (node.tagName === 'p') {
        removeEmptyParagraph(node, index, parent);
      }
    });

    await Promise.all(
      [...nodes].map(async ({ node, index, parent }) => {
        await transformLinkPreview(node, index, parent);
      }),
    );
  };
};

export default remark0218;
