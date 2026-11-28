import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';
import { SITE_URL } from '@/constants';

const SAFE_BLANK_TARGET_REL = 'noreferrer';

/** SITE_URL の前方一致だけにしない。`https://b.0218.jp.example.com/` のような別のホストを自サイトと誤るため */
export function isSiteUrl(href: string): boolean {
  return href === SITE_URL || href.startsWith(`${SITE_URL}/`);
}

function isInternalHref(href: string): boolean {
  if (href.startsWith('#') || href.startsWith('/')) return true;
  return isSiteUrl(href);
}

export default function rehypeExternalLink() {
  return function (tree: Root) {
    visit(tree, 'element', function (node: Element) {
      if (node.tagName !== 'a') return;
      const href = node.properties.href;
      if (typeof href !== 'string') return;

      // hast-util-sanitize は scheme を持たない URL を safe と扱うため、protocol-relative URL を落とす
      if (href.startsWith('//')) {
        node.properties.href = undefined;
        return;
      }

      if (!isInternalHref(href)) node.properties.target = '_blank';
      if (node.properties.target === '_blank') node.properties.rel = [SAFE_BLANK_TARGET_REL];
    });
  };
}
