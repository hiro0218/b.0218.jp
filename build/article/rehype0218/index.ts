import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';

import { SITE_URL } from '@/constants';
import transformImage from './transform/image';
import transformLinkPreview from './transform/linkPreview';
import type { LinkPreviewCache } from './transform/linkPreview/cache';
import { loadCache, saveCache } from './transform/linkPreview/cache';
import { handleError } from './transform/linkPreview/handleError';
import { removeEmptyParagraph } from './transform/paragraph';

export type { LinkPreviewCache };
export { loadCache, saveCache };

// import { wrapAll } from './transform/wrapAll';

const MAX_CONCURRENCY = 5;

export interface Rehype0218Options {
  /** 外部から渡す共有キャッシュ。指定時は内部で loadCache/saveCache を行わない */
  sharedCache?: LinkPreviewCache;
}

const rehype0218 = (options?: Rehype0218Options) => {
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

    const cache = options?.sharedCache ?? loadCache();
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
          transformLinkPreview(node, index, parent, cache)
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

    if (!options?.sharedCache) {
      saveCache(cache);
    }

    // wrapAll(tree);
  };
};

export default rehype0218;
