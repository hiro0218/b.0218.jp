import { type DOMNode, domToReact } from 'html-react-parser';
import { Alert } from '@/components/Page/Post/Alert';
import { parseJSON } from '@/lib/parseJSON';
import type { AlertDataProps, HandlerFunction } from '../types';

/**
 * アラート表示のハンドラー
 * class="gfm-alert"を持つ要素をAlertコンポーネントに変換する
 * @param domNode - 処理対象のDOMノード
 * @returns Alertコンポーネントまたはundefined
 */
export const handleAlert: HandlerFunction = (domNode) => {
  // class="gfm-alert"の要素を処理する
  if (domNode.attribs?.class === 'gfm-alert') {
    const json = parseJSON<AlertDataProps>(domToReact(domNode.children as DOMNode[]) as string);
    return <Alert type={json.data.type} text={json.data.text} />;
  }

  return undefined;
};
