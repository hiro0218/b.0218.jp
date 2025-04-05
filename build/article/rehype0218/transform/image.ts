import type { Element } from 'hast';

const transformImage = (node: Element, counter: number) => {
  node.properties = node.properties || {};
  if (counter > 0) {
    node.properties.loading = 'lazy';
    node.properties.decoding = 'async';
  }
};

export default transformImage;
