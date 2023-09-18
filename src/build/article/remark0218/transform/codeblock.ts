import type { Element } from 'hast';

const transformCodeblock = (node: Element) => {
  const classNames = node.properties?.className;

  if (Array.isArray(classNames) && classNames.includes('hljs')) {
    const dataLanguage = classNames.join(' ').replace('hljs language-', '');

    node.properties.dataLanguage = dataLanguage;
  }
};

export default transformCodeblock;
