import type { Element, HTMLReactParserOptions } from 'html-react-parser';
import type { ReactElement } from 'react';

/** DOM ノードをその場で変異させるハンドラ。マッチに関わらずチェーンは継続する。 */
export type Mutator = (domNode: Element) => void;

/** 置換用の React 要素を返すか、後続ハンドラに委ねる場合は undefined を返すハンドラ。 */
export type Replacer = (domNode: Element, options: HTMLReactParserOptions) => ReactElement | undefined;
