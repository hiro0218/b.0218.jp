import type { Element, Root } from 'hast';
import { visit } from 'unist-util-visit';
import { SITE_URL } from '@/constant';

export default function rehypeRemoveComments() {
  return function (tree: Root) {
    visit(tree, 'element', function (node: Element) {
      if (
        node.tagName === 'a' &&
        typeof node.properties.href === 'string' &&
        !node.properties.href.includes(SITE_URL)
      ) {
        node.properties.target = '_blank';
      }
    });
  };
}
