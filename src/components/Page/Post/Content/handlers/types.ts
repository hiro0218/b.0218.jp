import type { Element, HTMLReactParserOptions } from 'html-react-parser';

export type HandlerFunction = (
  domNode: Element,
  options?: HTMLReactParserOptions,
) => React.ReactElement | null | undefined;

export type ZoomImageSource = {
  src: string;
  srcSet?: string;
};
