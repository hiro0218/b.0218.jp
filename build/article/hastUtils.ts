import type { ElementContent } from 'hast';

/** hast ノードツリーからテキストを再帰的に収集する */
export function collectText(nodes: ElementContent[]): string {
  return nodes
    .map((node) => {
      if (node.type === 'text') return node.value;
      if (node.type === 'element') return collectText(node.children);
      return '';
    })
    .join('');
}
