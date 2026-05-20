import type { Element } from 'hast';
import { readLocalImageDimensions } from './imageDimensions';

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

export default transformImage;
