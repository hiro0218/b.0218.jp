import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';
import { SITE_URL } from '@/constants';

const SAFE_BLANK_TARGET_REL = 'noreferrer';

function isInternalHref(href: string): boolean {
  if (href.startsWith('#') || href.startsWith('/')) return true;
  return href === SITE_URL || href.startsWith(`${SITE_URL}/`);
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
