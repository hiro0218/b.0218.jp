'use client';

import { XIcon } from '@phosphor-icons/react';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { type AnimationEvent, type MouseEvent, type SyntheticEvent, useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { ICON_SIZE_XS } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';
import { stateLayer } from '@/ui/styled/components/stateLayerControl';
import { SEARCH_LABELS } from './constants';
import { SearchEmptyState } from './SearchDialog/SearchEmptyState';
import { SearchFooter } from './SearchDialog/SearchFooter';
import { SearchHeader } from './SearchDialog/SearchHeader';
import { SearchResultList } from './SearchDialog/SearchResultList';
import { truncateQuery } from './SearchDialog/truncateQuery';
import { useSearch } from './SearchDialog/useSearch';
import type { PopularPost } from './types';

// Dialog の CSS（data-closing の animation）と別の名前にしない。食い違うと、閉じるアニメーションの終わりを拾えず、ダイアログが閉じないまま残るため
const EXIT_ANIMATIONS = new Set(['zoomOut', 'fadeOut']);

type Props = {
  popularPosts: PopularPost[];
  /** 閉じるアニメーションの最中。終わるまで、このダイアログを描画したままにする */
  isClosing: boolean;
  /** 閉じる操作（Esc・戻る・背景・閉じるボタン・記事を開く）の要求。閉じる途中への移行は呼び出し側が行う */
  onRequestCloseAction: () => void;
  /** 閉じ終えたとき。呼び出し側がこのダイアログを外す */
  onClosedAction: () => void;
};

export function SearchDialog({ popularPosts, isClosing, onRequestCloseAction, onClosedAction }: Props) {
  const id = useId();
  const labelledId = `${id}-labelled`;
  const describedId = `${id}-described`;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const search = useSearch({ popularPosts, inputRef, onRequestClose: onRequestCloseAction });

  const { dialogProps } = useDialog(
    {
      'aria-labelledby': labelledId,
      'aria-describedby': describedId,
    },
    dialogRef,
  );

  // 焦点は、開く前には置かない。閉じた dialog（display: none）の中では focus() が何も起きない。
  // 焦点を showModal() に任せない。showModal() は木の順で最初に焦点を取れる要素へ移す。
  // 画面が低く外側の面がスクロールすると、Chrome はその箱を先に取り、入力欄に打てなくなる。
  // 開いていれば開き直さない。開発時の StrictMode は、この effect を続けて 2 回実行するため
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    inputRef.current.focus({ preventScroll: true });
  }, []);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      search.close();
    }
  };

  // cancel（Esc・Android の戻る操作）を既定のままにしない。既定だと dialog だけが閉じ、
  // 開閉の状態（SearchProvider の status）が「開いている」まま残り、検索ボタンでも「/」でも開き直せなくなるため。
  // Esc のキー入力だけでは処理しない（useSearch のキー操作）。入力欄と一覧の外の Esc は届かず、戻る操作は keydown を伴わないため
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    search.close();
  };

  // 中の要素の animationend には反応しない。animationend は中の要素のものも伝わってくるため。
  // 固定の時間（150ms）のタイマーは使わない。CSS の --transition-normal の値の写しで、CSS を変えると食い違うため
  const handleAnimationEnd = (event: AnimationEvent<HTMLDialogElement>) => {
    if (event.target !== event.currentTarget || !EXIT_ANIMATIONS.has(event.animationName)) return;

    event.currentTarget.close();
    onClosedAction();
  };

  // 結果を待っている間（null）と、未入力のとき（候補を出していて、検索結果は無い）は、「0 件」と読み上げない
  const statusMessage =
    search.mode === 'results' && search.results
      ? `${search.results.length}件の検索結果が見つかりました。「${truncateQuery(search.query)}」の検索結果です。`
      : '';
  // 0 件のときは、フッター（キー操作の案内）を出さない。選ぶ行が無いため。
  // 結果を待っている間（null）は、次の手（Google 検索）を出さない。0 件と決まっていないため
  const hasNoResults = search.mode === 'results' && search.results?.length === 0;
  const hasList = search.rows.length > 0;

  return createPortal(
    <FocusScope contain restoreFocus>
      <Dialog
        {...dialogProps}
        data-closing={isClosing}
        onAnimationEnd={handleAnimationEnd}
        onCancel={handleCancel}
        onClick={handleBackdropClick}
        // animationend だけで閉じ終えを知らせない。cancel を止められないとき（連続した Esc など）は、dialog が先に閉じるため。
        // 閉じる途中かどうかは判定しない。閉じ終えの通知は何度呼んでも同じで、animationend のあとに来る close と重なっても害がないため。
        // 閉じる操作の要求（onRequestCloseAction）は呼ばない。閉じた dialog には閉じるアニメーションが掛からず、「閉じる途中」のまま止まるため
        onClose={onClosedAction}
        ref={dialogRef}
      >
        <h2 className="sr-only" id={labelledId}>
          {SEARCH_LABELS.searchTitle}
        </h2>
        <p className="sr-only" id={describedId}>
          {SEARCH_LABELS.searchDescription}
        </p>
        <Surface>
          <SearchHeader
            activeDescendantId={search.activeDescendantId}
            hasList={hasList}
            inputRef={inputRef}
            listId={search.listId}
            onClear={search.clear}
            onKeyDown={search.handleKeyDown}
            onValueChange={search.changeInput}
            value={search.inputValue}
          />
          <SearchMain aria-label={SEARCH_LABELS.siteSearch}>
            <div aria-atomic="true" aria-live="polite" className="sr-only" role="status">
              {statusMessage}
            </div>

            {hasList ? (
              <SearchResultList
                focusedIndex={search.focusedIndex}
                listId={search.listId}
                listRef={search.listRef}
                mode={search.mode}
                onKeyDown={search.handleKeyDown}
                onPostSelect={search.selectPost}
                onRecentSelect={search.searchRecent}
                onRowMouseMove={search.hoverRow}
                query={search.query}
                rows={search.rows}
                setRowRef={search.setRowRef}
              />
            ) : null}

            {hasNoResults ? (
              <SearchEmptyState searchQuery={search.query} />
            ) : (
              <SearchFooter searchQuery={search.query} />
            )}
          </SearchMain>
        </Surface>
        {/* 入力欄の中には置かず、ダイアログの右上の角にはみ出させ、形も円にする。入力欄の中の「キーワードを消す」と取り違えるため */}
        <CloseButton aria-label={SEARCH_LABELS.closeDialog} className={stateLayer} onClick={search.close} type="button">
          <XIcon aria-hidden="true" height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
        </CloseButton>
      </Dialog>
    </FocusScope>,
    document.body,
  );
}

// 面・角丸・切り取り（overflow）は、dialog 自体に持たせず、内側の Surface に持たせる。dialog 自体で切り取ると、角にはみ出す閉じるボタンが見えなくなるため。
// 縦の位置は、dialog 既定の縦中央寄せにせず、上に固定する。中央寄せだと、件数が変わるたびに高さが変わり、入力欄の上端が上下に動くため
const Dialog = styled.dialog`
  --search-dialog-max-height: 80dvh;
  --search-dialog-top: calc((100dvh - var(--search-dialog-max-height)) / 2);
  --search-content-max-height: 55dvh;
  --search-close-size: var(--sizes-touch-target);
  --search-close-overhang: var(--spacing-300);

  position: fixed;
  top: var(--search-dialog-top);
  width: var(--sizes-container-md);
  max-height: var(--search-dialog-max-height);
  padding: 0;
  margin-block: 0;
  overflow: visible;
  background-color: transparent;
  border: none;
  isolation: isolate;

  @media (max-height: 20rem) {
    --search-content-max-height: none;
  }

  &:not([open]) {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
  }

  &[open] {
    visibility: visible;
    pointer-events: auto;
    opacity: 1;
    animation: zoomIn var(--transition-slow);
  }

  &[open][data-closing='true'] {
    animation: zoomOut var(--transition-normal) forwards;
  }

  @media (prefers-reduced-motion: reduce) {
    &[open] {
      animation: fadeIn var(--transition-normal);
    }

    &[open][data-closing='true'] {
      animation: fadeOut var(--transition-normal) forwards;
    }
  }

  &[open]::backdrop {
    cursor: pointer;
    background-color: var(--colors-overlay-backgrounds);
    opacity: 1;
    transition: opacity var(--transition-slow);

    @starting-style {
      opacity: 0;
    }
  }

  &[open][data-closing='true']::backdrop {
    opacity: 0;
    transition: opacity var(--transition-normal);
  }
`;

// 影と枠線は使わない。
// 常にこの面全体をスクロールさせる形にはしない。一覧も自分の max-height でスクロールし、画面が低いと二重になるため。
// 低い画面でも一覧だけを縮める形にはしない。入力欄が 2 行に折り返す狭い画面では、一覧が 16px になり結果が読めないため
const Surface = styled.div`
  display: flex;
  flex-direction: column;
  max-height: inherit;
  overflow: auto;
  color: var(--colors-gray-900);
  background-color: var(--colors-body-background);
  border-radius: var(--radii-md);

  @media (max-height: 20rem) {
    display: block;
  }
`;

const SearchMain = styled.search`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// 背景は主の操作の黒にしない。補助の操作のため。
// stateLayerControl は再利用しない。面（background-color）と角丸（円）が違い、2 つの class が同じ property を持つと適用順が定まらないため
const CloseButton = styled.button`
  position: absolute;
  top: calc(var(--search-close-overhang) * -1);
  right: calc(var(--search-close-overhang) * -1);
  display: grid;
  place-items: center;
  width: var(--search-close-size);
  height: var(--search-close-size);
  color: var(--colors-gray-900);
  cursor: pointer;
  background-color: var(--colors-body-background);
  border-radius: var(--radii-full);

  &:focus-visible {
    outline: var(--border-widths-medium) solid transparent;
    outline-offset: var(--border-widths-medium);
    box-shadow: var(--focus-ring-shadow);
  }
`;
