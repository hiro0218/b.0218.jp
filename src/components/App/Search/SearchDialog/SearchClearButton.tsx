import { css, cx } from '@/ui/styled';
import { stateLayerControl } from '@/ui/styled/components/stateLayerControl';
import { SEARCH_LABELS } from '../constants';

type Props = {
  onClear: () => void;
};

/**
 * @summary 入力した語を消す、言葉のボタン（SearchHeader）。
 * アイコンの × にしない。ダイアログの角にある「検索を閉じる」の × と取り違えるため。
 */
export function SearchClearButton({ onClear }: Props) {
  return (
    <button className={cx(stateLayerControl, clearButtonStyle)} onClick={onClear} type="button">
      {SEARCH_LABELS.clearQuery}
    </button>
  );
}

// stateLayerControl の既定（アイコンだけのボタン向けの正方形）のままにしない。語が折り返してしまうため
const clearButtonStyle = css`
  flex-shrink: 0;
  padding-inline: var(--spacing-100);
  font-family: inherit;
  font-size: var(--font-sizes-sm);
  white-space: nowrap;
`;
