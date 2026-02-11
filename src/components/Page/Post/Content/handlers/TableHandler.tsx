import { type DOMNode, domToReact } from 'html-react-parser';
import type { HandlerFunction } from './types';

/**
 * tableタグを<div class="c-table-scrollable">で包括する
 */
export const handleTable: HandlerFunction = (domNode, options) => {
  if (domNode.name !== 'table') {
    return undefined;
  }

  const { style, class: className, cellspacing, cellpadding, ...restAttribs } = domNode.attribs || {};

  return (
    <div className="c-table-scrollable">
      <table cellPadding={cellpadding} cellSpacing={cellspacing} className={className} {...restAttribs}>
        {domToReact(domNode.children as DOMNode[], options)}
      </table>
    </div>
  );
};
