import type { Element } from 'hast';

const transformImage = (node: Element) => {
  node.properties = {
    ...(node.properties || {}),
    loading: 'lazy',
  };
};

export default transformImage;
