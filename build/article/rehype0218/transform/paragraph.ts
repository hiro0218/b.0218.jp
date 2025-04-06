import type { Element } from 'hast';

export const removeEmptyParagraph = (node: Element, index: number, parent: Element) => {
  if (node.children.length === 0) {
    parent.children.splice(index, 1);
  }
};
