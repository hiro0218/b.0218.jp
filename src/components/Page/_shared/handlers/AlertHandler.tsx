import { type DOMNode, domToReact } from 'html-react-parser';
import { Alert, type AlertType } from '@/components/UI/Alert';
import { isObject } from '@/lib/utils/isObject';
import { safeJsonParse } from '@/lib/utils/json';
import type { Replacer } from './types';

interface AlertData {
  type: 'alert';
  data: {
    type: AlertType;
    text: string;
  };
}

const ALERT_TYPES = new Set<AlertType>(['note', 'tip', 'important', 'warning', 'caution']);

function isAlertData(value: unknown): value is AlertData {
  if (!isObject(value) || value.type !== 'alert' || !isObject(value.data)) {
    return false;
  }

  return (
    typeof value.data.type === 'string' &&
    ALERT_TYPES.has(value.data.type as AlertType) &&
    typeof value.data.text === 'string'
  );
}

/**
 * class="gfm-alert"を持つ要素をAlertコンポーネントに変換する
 */
export const handleAlert: Replacer = (domNode) => {
  if (domNode.attribs?.class !== 'gfm-alert') {
    return undefined;
  }

  const json = safeJsonParse<AlertData>(domToReact(domNode.children as DOMNode[]) as string);

  if (!isAlertData(json)) {
    // biome-ignore lint/complexity/noUselessFragments: 不正な placeholder を DOM に残さず空に置換する
    return <></>;
  }

  return <Alert html={json.data.text} type={json.data.type} />;
};
