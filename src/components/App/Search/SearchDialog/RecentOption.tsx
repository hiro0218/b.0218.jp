import { ClockCounterClockwiseIcon } from '@phosphor-icons/react';
import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { cx } from '@/ui/styled';
import { optionStyle, recentChipStyle } from './options.styles';

type Props = {
  id: string;
  /** 前に検索した語 */
  query: string;
  index: number;
  isSelected: boolean;
  onSelect: (query: string) => void;
  onMouseMove: (index: number) => void;
  /** 行の要素を、フォーカス位置の添字で引けるよう登録する（スクロールに使う）。安定した関数を渡す */
  setRef: (index: number, element: HTMLElement | null) => void;
};

/**
 * @summary 最近の検索の語。選ぶと、その語で検索し直す。
 */
export function RecentOption({ id, query, index, isSelected, onSelect, onMouseMove, setRef }: Props) {
  return (
    <button
      aria-selected={isSelected}
      className={cx(optionStyle, recentChipStyle)}
      id={id}
      onClick={() => onSelect(query)}
      onMouseMove={() => onMouseMove(index)}
      ref={(element) => setRef(index, element)}
      role="option"
      tabIndex={-1}
      type="button"
    >
      {/* 時計のアイコンを省かない。「前に検索した語」と示さないと、同じ形のタグと取り違えるため */}
      <ClockCounterClockwiseIcon aria-hidden="true" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
      <span>{query}</span>
    </button>
  );
}
