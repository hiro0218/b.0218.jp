import type { Element } from 'html-react-parser';
import type { AlertType } from '@/components/Page/Post/Alert';

/**
 * HTMLパーサーの共通型定義
 */

/**
 * アラートデータの型定義
 */
export type AlertDataProps = {
  type: 'alert';
  data: {
    type: AlertType;
    text: string;
  };
};

/**
 * リンクプレビューデータの型定義
 */
export type LinkPreviewDataProps = {
  type: 'link-preview';
  data: {
    link: string;
    card: string;
    thumbnail: string;
    title: string;
    description: string;
    domain: string;
  };
};

/**
 * ハンドラーの条件判定と処理を行う関数の型
 * @param domNode - 処理対象のDOMノード
 * @returns 条件に合致した場合は処理結果、合致しない場合はundefined
 */
export type HandlerFunction = (domNode: Element) => React.ReactElement | null | undefined;
