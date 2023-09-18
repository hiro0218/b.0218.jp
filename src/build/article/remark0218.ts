import type { Element, Root } from 'hast';
import { type Transformer } from 'unified';
import { visit } from 'unist-util-visit';

import transformCodeblock from './transform/codeblock';
import transformImage from './transform/image';
import transformLinkPreview from './transform/linkPreview';
import { removeEmptyParagraph } from './transform/paragraph';
import { wrapAll } from './transform/wrapAll';

const remark0218 = (): Transformer => {
  const nodes = new Set<{ node: Element; index: number; parent: Element }>();
  let imageCounter = 0;

  return async (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName === 'a' && node.children.length > 0) {
        if (node.children[0]?.type === 'text') {
          nodes.add({ node, index, parent });
        }
      }

      if (node.tagName === 'img') {
        transformImage(node, imageCounter);
        imageCounter++;
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

    wrapAll(tree as unknown as Root);
  };
};

export default remark0218;
