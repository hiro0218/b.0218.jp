import type { Element, HTMLReactParserOptions } from 'html-react-parser';
import type { ReactElement } from 'react';

/** Handler that mutates a DOM node in place; the chain continues regardless. */
export type Mutator = (domNode: Element) => void;

/** Handler that produces a replacement React element, or undefined to defer to the next handler. */
export type Replacer = (domNode: Element, options: HTMLReactParserOptions) => ReactElement | undefined;
