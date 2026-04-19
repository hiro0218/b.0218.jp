import { type DOMNode, domToReact } from 'html-react-parser';
import { toSafeProps } from './attribs';
import type { HandlerFunction } from './types';

/**
 * tableタグを<div class="c-table-scrollable">で包括する
 */
export const handleTable: HandlerFunction = (domNode, options) => {
  if (domNode.name !== 'table') {
    return undefined;
  }

  return (
    <div className="c-table-scrollable">
      <table {...toSafeProps(domNode)}>{domToReact(domNode.children as DOMNode[], options)}</table>
    </div>
  );
};
