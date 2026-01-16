import reactHtmlParser, { Element, type HTMLReactParserOptions } from 'html-react-parser';
import { handleAlert, handleAnchor, handleCodePen, handleLinkPreview, handleTable, handleZoomImage } from '../handlers';

const applyHandlers = (domNode: Element) => {
  return (
    handleAnchor(domNode) ||
    handleAlert(domNode) ||
    handleLinkPreview(domNode) ||
    handleCodePen(domNode) ||
    handleTable(domNode) ||
    handleZoomImage(domNode) ||
    domNode
  );
};

const reactHtmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode.attribs)) {
      return domNode;
    }

    return applyHandlers(domNode);
  },
};

export const parser = (content: string) => {
  return reactHtmlParser(content, reactHtmlParserOptions);
};
