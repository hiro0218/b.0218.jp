import reactHtmlParser, { type Element, type HTMLReactParserOptions } from 'html-react-parser';
import {
  handleAlert,
  handleAnchor,
  handleCodePen,
  handleLinkPreview,
  handleTable,
  handleZoomImage,
  type Mutator,
  type Replacer,
} from '../handlers';

const mutators: Mutator[] = [handleCodePen];

const replacers: Replacer[] = [handleAnchor, handleAlert, handleLinkPreview, handleTable, handleZoomImage];

const isTagElement = (domNode: unknown): domNode is Element => {
  return typeof domNode === 'object' && domNode !== null && (domNode as Element).type === 'tag';
};

const applyHandlers = (domNode: Element, options: HTMLReactParserOptions) => {
  for (const mutate of mutators) mutate(domNode);

  for (const replace of replacers) {
    const result = replace(domNode, options);
    if (result !== undefined) return result;
  }

  return domNode;
};

const reactHtmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!isTagElement(domNode) || !domNode.attribs) {
      return domNode;
    }

    return applyHandlers(domNode, reactHtmlParserOptions);
  },
};

export const parser = (content: string) => {
  return reactHtmlParser(content, reactHtmlParserOptions);
};
