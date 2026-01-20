import { type DOMNode, domToReact } from 'html-react-parser';
import type { HandlerFunction } from './types';

/**
 * tableタグを<div class="c-table-scrollable">で包括する
 */
export const handleTable: HandlerFunction = (domNode, options) => {
  if (domNode.name === 'table') {
    const { style, ...restAttribs } = domNode.attribs || {};

    return (
      <div className="c-table-scrollable">
        <table {...restAttribs}>{domToReact(domNode.children as DOMNode[], options)}</table>
      </div>
    );
  }

  return undefined;
};
