import { HashIcon } from '@phosphor-icons/react';
import Link from 'next/link';
import { Fragment } from 'react';
import { convertPostSlugToPath } from '@/lib/utils/url';
import { cx } from '@/ui/styled';
import { matchedTagStyle, optionStyle, postRowStyle } from './options.styles';

type Props = {
  id: string;
  slug: string;
  title: string;
  /** タグだけに一致した行で、一致したタグ */
  matchedTag?: string;
  /** タイトルの一致した文字を強調する正規表現（捕捉括弧は全体で 1 つ）。強調しない行（候補）は null */
  highlight: RegExp | null;
  index: number;
  isSelected: boolean;
  /** 移動はリンク自身が行う */
  onClick: () => void;
  onMouseMove: (index: number) => void;
  /** 行の要素を、フォーカス位置の添字で引けるよう登録する（スクロールに使う）。安定した関数を渡す */
  setRef: (index: number, element: HTMLElement | null) => void;
};

function splitByMatches(title: string, pattern: RegExp | null) {
  const segments: Array<{ text: string; marked: boolean; start: number }> = [];
  let start = 0;

  for (const [i, text] of (pattern ? title.split(pattern) : [title]).entries()) {
    if (text !== '') segments.push({ text, marked: i % 2 === 1, start });
    start += text.length;
  }

  return segments;
}

/**
 * @summary 記事の行。
 * option の中にリンクを置かず、リンク自体を option にする。置くと nested-interactive になるため。
 * roving tabindex は使わない。フォーカスは入力欄に置いたまま、選ばれた行は aria-activedescendant と aria-selected で示すため。
 */
export function PostOption({
  id,
  slug,
  title,
  matchedTag,
  highlight,
  index,
  isSelected,
  onClick,
  onMouseMove,
  setRef,
}: Props) {
  return (
    <Link
      aria-selected={isSelected}
      className={cx(optionStyle, postRowStyle)}
      href={convertPostSlugToPath(slug)}
      id={id}
      onClick={onClick}
      // mouseenter は使わない。ポインターを動かさなくても、一覧の入れ替えや ↑↓ のスクロールで、下に来た行へ mouseenter が起きる。
      // mouseenter が、自動で選んだ 1 件目や ↑↓ で選んだ行を奪い、Enter で開く行が変わるため
      onMouseMove={() => onMouseMove(index)}
      prefetch={false}
      // 一覧側で行ごとの関数を作って渡さない。フォーカスが動くたびに全行（最大 100）の ref が変わり、next/link を含む全行が再描画されるため
      ref={(element) => setRef(index, element)}
      role="option"
      tabIndex={-1}
    >
      {/* 行頭のアイコンは置かない。結果はすべて記事で、アイコンで区別する情報が無いため */}
      <span>
        {splitByMatches(title, highlight).map((segment) =>
          segment.marked ? (
            <mark key={segment.start}>{segment.text}</mark>
          ) : (
            <Fragment key={segment.start}>{segment.text}</Fragment>
          ),
        )}
      </span>
      {matchedTag ? (
        <span className={matchedTagStyle}>
          <HashIcon aria-hidden="true" height="1em" width="1em" />
          <mark>{matchedTag}</mark>
          <span className="sr-only">タグに一致</span>
        </span>
      ) : null}
    </Link>
  );
}
