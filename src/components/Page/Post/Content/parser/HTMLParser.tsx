import reactHtmlParser, { Element, type HTMLReactParserOptions } from 'html-react-parser';
import { handleAlert, handleAnchor, handleCodePen, handleLinkPreview, handleTable, handleZoomImage } from '../handlers';

const applyHandlers = (domNode: Element, options: HTMLReactParserOptions) => {
  return (
    handleAnchor(domNode, options) ||
    handleAlert(domNode, options) ||
    handleLinkPreview(domNode, options) ||
    handleCodePen(domNode, options) ||
    handleTable(domNode, options) ||
    handleZoomImage(domNode, options) ||
    domNode
  );
};

const reactHtmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode.attribs)) {
      return domNode;
    }

    return applyHandlers(domNode, reactHtmlParserOptions);
  },
};

export const parser = (content: string) => {
  return reactHtmlParser(content, reactHtmlParserOptions);
};
