import { Processor, Transformer } from 'unified';
import { visit } from 'unist-util-visit';

export default function remark0218(this: Processor): Transformer {
  function visitor(el): void {
    if (el.tagName === 'img') {
      el.properties = {
        ...(el.properties || {}),
        loading: 'lazy',
      };

      return;
    }

    if (el.tagName === 'code' && Array.isArray(el.properties?.className) && el.properties.className.includes('hljs')) {
      const className = el.properties?.className.join(' ').replace('hljs language-', '');
      el.properties.dataLanguage = className;

      return;
    }
  }

  function transformer(htmlAST) {
    visit(htmlAST, 'element', visitor);

    return htmlAST;
  }

  return transformer;
}
