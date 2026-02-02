import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

import { SITE_URL } from '@/constants';
import transformImage from './transform/image';
import transformLinkPreview from './transform/linkPreview';
import { removeEmptyParagraph } from './transform/paragraph';

// import { wrapAll } from './transform/wrapAll';

const rehype0218 = () => {
  const nodes = new Set<{ node: Element; index: number; parent: Element }>();
  let imageCounter = 0;

  return async (tree: Root) => {
    visit(tree, 'element', (node: Element, index, giveParent: Root | Element | null) => {
      const parent = giveParent as Element;

      if (node.tagName === 'a' && node.children.length > 0) {
        // 同サイトのリンクは絶対パスに変換する
        if (typeof node.properties.href === 'string' && node.properties.href.includes(SITE_URL)) {
          const href = node.properties.href.replace(SITE_URL, '');
          node.properties.href = href;
        }

        if (node.children[0]?.type === 'text') {
          nodes.add({ node, index, parent });
        }
      }

      if (node.tagName === 'img') {
        transformImage(node, imageCounter);
        imageCounter++;
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

    // wrapAll(tree);
  };
};

export default rehype0218;
