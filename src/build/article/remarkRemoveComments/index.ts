import type { Nodes, Root } from 'hast';
import { visit } from 'unist-util-visit';

const regex = /^\[if[ \t\f\n\r]+[^\]]+]|<!\[endif]$/;

function isComment(node: Nodes) {
  return node.type === 'comment' && regex.test(node.value);
}

export default function rehypeRemoveComments() {
  return function (tree: Root) {
    visit(tree, 'comment', function (node, index, parent) {
      if (typeof index === 'number' && parent && !isComment(node)) {
        parent.children.splice(index, 1);
        return index;
      }
    });
  };
}
