import { type DOMNode, domToReact } from 'html-react-parser';
import { Alert, type AlertType } from '@/components/UI/Alert';
import { safeJsonParse } from '@/lib/utils/json';
import type { HandlerFunction } from './types';

interface AlertData {
  type: 'alert';
  data: {
    type: AlertType;
    text: string;
  };
}

/**
 * class="gfm-alert"を持つ要素をAlertコンポーネントに変換する
 */
export const handleAlert: HandlerFunction = (domNode) => {
  if (domNode.attribs?.class === 'gfm-alert') {
    const json = safeJsonParse<AlertData>(domToReact(domNode.children as DOMNode[]) as string);

    if (!json) {
      return undefined;
    }

    return <Alert text={json.data.text} type={json.data.type} />;
  }

  return undefined;
};
