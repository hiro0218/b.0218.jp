import hast from 'hast';
import { Processor, Transformer } from 'unified';
import { visit } from 'unist-util-visit';

export default function remark0218(this: Processor): Transformer {
  function visitor(el: hast.Element, i: number, parent: hast.Parent): void {
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

    if (el.tagName === 'table') {
      console.log(parent);
    }
  }

  function transformer(htmlAST) {
    visit(htmlAST, 'element', visitor);

    return htmlAST;
  }

  return transformer;
}
