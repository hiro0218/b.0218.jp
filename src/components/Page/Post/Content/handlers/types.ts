import type { Element, HTMLReactParserOptions } from 'html-react-parser';
import type { ReactElement } from 'react';

export type HandlerReturn = ReactElement | Element | null | undefined;

export type HandlerFunction = (domNode: Element, options?: HTMLReactParserOptions) => HandlerReturn;
