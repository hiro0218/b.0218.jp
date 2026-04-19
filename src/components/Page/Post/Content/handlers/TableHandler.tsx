import { attributesToProps, type DOMNode, domToReact } from 'html-react-parser';
import type { HandlerFunction } from './types';

/**
 * tableタグを<div class="c-table-scrollable">で包括する
 */
export const handleTable: HandlerFunction = (domNode, options) => {
  if (domNode.name !== 'table') {
    return undefined;
  }

  const props = attributesToProps(domNode.attribs, domNode.name);

  return (
    <div className="c-table-scrollable">
      <table {...props}>{domToReact(domNode.children as DOMNode[], options)}</table>
    </div>
  );
};
