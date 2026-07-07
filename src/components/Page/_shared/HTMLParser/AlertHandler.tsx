import { type DOMNode, domToReact } from 'html-react-parser';
import { Alert } from '@/components/UI/Alert';
import { type AlertData, GFM_ALERT_CLASS_NAME, isAlertData } from '@/lib/domain/embeddedContent';
import { safeJsonParse } from '@/lib/utils/json';
import type { Replacer } from './types';

/**
 * class="gfm-alert"を持つ要素をAlertコンポーネントに変換する
 */
export const handleAlert: Replacer = (domNode) => {
  if (domNode.attribs?.class !== GFM_ALERT_CLASS_NAME) {
    return undefined;
  }

  const json = safeJsonParse<AlertData>(domToReact(domNode.children as DOMNode[]) as string);

  if (!isAlertData(json)) {
    // biome-ignore lint/complexity/noUselessFragments: 不正な placeholder を DOM に残さず空に置換する
    return <></>;
  }

  // 契約の AlertKind を UI の AlertType へ橋渡しする箇所。両者の値集合が乖離すると
  // （UI が未対応の値を持つと）ここが代入エラーになり、片側だけの変更を検出できる。
  return <Alert html={json.data.text} type={json.data.type} />;
};
