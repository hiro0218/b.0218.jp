import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

import { SITE_URL } from '@/constants';
import type { LinkPreviewCache } from '../linkPreviewCache';
import { readLocalImageDimensions } from './imageDimensions';
import transformLinkPreview from './linkPreview';
import { handleError } from './linkPreviewError';

const MAX_CONCURRENCY = 5;

export interface Rehype0218Options {
  /** プラグインの中で load・save しない。呼び出し側と別のキャッシュができると、増えたエントリが呼び出し側の保存した版に入らず、次回の変換キャッシュの版とずれる。読み書きは呼び出し側(post.ts)だけが行う */
  sharedCache: LinkPreviewCache;
}

const transformImage = (node: Element, counter: number) => {
  node.properties = node.properties || {};

  if (typeof node.properties.src === 'string' && (node.properties.width == null || node.properties.height == null)) {
    const dimensions = readLocalImageDimensions(node.properties.src);
    if (dimensions) {
      node.properties.width ??= dimensions.width;
      node.properties.height ??= dimensions.height;
    }
  }

  if (counter > 0) {
    node.properties.loading = 'lazy';
    node.properties.decoding = 'async';
  }
};

const removeEmptyParagraph = (node: Element, index: number, parent: Element) => {
  if (node.children.length === 0) {
    parent.children.splice(index, 1);
  }
};

const rehype0218 = (options: Rehype0218Options) => {
  return async (tree: Root) => {
    const nodes = new Set<{ node: Element; index: number; parent: Element }>();
    let imageCounter = 0;

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

    const entries = [...nodes];

    // セマフォによる並行数制御（最大5並列）
    let running = 0;
    let idx = 0;

    await new Promise<void>((resolve) => {
      if (entries.length === 0) {
        resolve();
        return;
      }

      const next = () => {
        while (running < MAX_CONCURRENCY && idx < entries.length) {
          const { node, index, parent } = entries[idx++];
          running++;
          transformLinkPreview(node, index, parent, options.sharedCache)
            .catch((error) => {
              handleError(error, 'Unhandled error in link preview transform');
            })
            .finally(() => {
              running--;
              if (idx >= entries.length && running === 0) {
                resolve();
              } else {
                next();
              }
            });
        }
      };

      next();
    });
  };
};

export default rehype0218;
