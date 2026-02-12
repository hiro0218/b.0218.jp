import type { Element, ElementContent, Text } from 'hast';

/** hast Text ノードの型ガード */
export function isTextNode(node: ElementContent): node is Text {
  return node.type === 'text';
}

/** hast Element ノードの型ガード */
export function isElementNode(node: ElementContent): node is Element {
  return node.type === 'element';
}

/** hast ノードツリーからテキストを再帰的に収集する */
export function collectText(nodes: ElementContent[]): string {
  return nodes
    .map((node) => {
      if (isTextNode(node)) return node.value;
      if (isElementNode(node)) return collectText(node.children);
      return '';
    })
    .join('');
}
