import type { Element } from 'hast';

const transformCodeblock = (node: Element) => {
  if (Array.isArray(node.properties?.className) && node.properties.className.includes('hljs')) {
    const className = node.properties?.className.join(' ').replace('hljs language-', '');
    node.properties.dataLanguage = className;
  }
};

export default transformCodeblock;
