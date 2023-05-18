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
    visit(tree, { tagName: 'a' }, function visitor(node: Element, index, parent) {
      nodes.add({ node, index, parent });
    });

    await Promise.all(
      [...nodes].map(async ({ node, index, parent }) => {
        await transformLinkPreview(node, index, parent);
      }),
    );

    visit(tree, { tagName: 'img' }, function visitor(node: Element) {
      transformImage(node);
    });

    visit(tree, { tagName: 'code' }, function visitor(node: Element) {
      transformCodeblock(node);
    });

    visit(tree, { tagName: 'p' }, function visitor(node: Element, index, parent) {
      removeEmptyParagraph(node, index, parent);
    });
  };
};

export default remark0218;
