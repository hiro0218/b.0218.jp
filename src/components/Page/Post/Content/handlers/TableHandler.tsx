import { type DOMNode, domToReact } from 'html-react-parser';
import type { HandlerFunction } from './types';

/**
 * tableタグを<div class="c-table-scrollable">で包括する
 */
export const handleTable: HandlerFunction = (domNode) => {
  if (domNode.name === 'table') {
    return (
      <div className="c-table-scrollable">
        <table {...domNode.attribs}>{domToReact(domNode.children as DOMNode[])}</table>
      </div>
    );
  }

  return undefined;
};
