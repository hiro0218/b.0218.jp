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

// mutators run unconditionally on every node; replacers short-circuit on the first match.
const mutators: Mutator[] = [handleCodePen];

const replacers: Replacer[] = [handleAnchor, handleAlert, handleLinkPreview, handleTable, handleZoomImage];

// rehypeGfmAlert は blockquote を <script type="application/json" class="gfm-alert"> に変換するため、
// htmlparser2 の type が 'script' / 'style' になる要素もハンドラ対象に含める。
const isReplaceableElement = (domNode: unknown): domNode is Element => {
  if (typeof domNode !== 'object' || domNode === null) return false;
  const type = (domNode as Element).type;
  return type === 'tag' || type === 'script' || type === 'style';
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
    if (!isReplaceableElement(domNode) || !domNode.attribs) {
      return domNode;
    }

    return applyHandlers(domNode, reactHtmlParserOptions);
  },
};

export const parser = (content: string) => {
  return reactHtmlParser(content, reactHtmlParserOptions);
};
