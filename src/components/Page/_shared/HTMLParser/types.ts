import type { Element, HTMLReactParserOptions } from 'html-react-parser';
import type { ReactElement } from 'react';

/** 置換用の React 要素を返すか、後続ハンドラに委ねる場合は undefined を返すハンドラ。 */
export type Replacer = (domNode: Element, options: HTMLReactParserOptions) => ReactElement | undefined;
