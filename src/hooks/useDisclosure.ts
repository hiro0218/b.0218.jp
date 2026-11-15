'use client';

import { useInteractOutside } from '@react-aria/interactions';
import { type FocusEvent, type KeyboardEvent, useCallback, useRef, useState } from 'react';

/**
 * ボタンで開閉する領域（disclosure）の開閉の状態と、閉じる操作（領域の外の操作・領域の外への焦点の移動・Esc）を受け持つ。
 * rootProps は、トリガーとパネルを含む要素へ広げる。triggerRef は、トリガーのボタンに付ける。
 */
export function useDisclosure() {
  const [isExpanded, setIsExpanded] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const collapse = useCallback(() => setIsExpanded(false), []);

  // 領域の外の操作で閉じる（開いている場合のみハンドラを設定）
  useInteractOutside({
    ref: rootRef,
    isDisabled: !isExpanded,
    onInteractOutside: collapse,
  });

  // 閉じたあとにフォーカスをパネルの中へ残さない。閉じたパネルは inert や display: none になり、フォーカスは body へ落ちる
  const collapseToTrigger = () => {
    collapse();
    triggerRef.current?.focus();
  };

  // document の keydown では受けない。検索ダイアログなど他の dialog の Esc まで拾い、除外する特例が要るため
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isExpanded || event.key !== 'Escape') return;

    collapseToTrigger();
  };

  // relatedTarget が無いときは閉じない。ウィンドウの切り替えでは戻ったときに開いた状態を保ち、フォーカスできない場所のクリックは useInteractOutside が受け持つため
  // collapseToTrigger を使わない。Tab でパネルを抜けた焦点をトリガーへ戻すと、次の Tab が同じ領域へ戻り、先へ進めなくなるため
  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!(event.relatedTarget instanceof Node)) return;
    if (event.currentTarget.contains(event.relatedTarget)) return;

    collapse();
  };

  // フォーカスをクリックの移動に任せない。macOS の Safari・Firefox はクリックでボタンにフォーカスが当たらず、Esc をこの要素の中で受けられなくなるため
  const toggle = () => {
    if (!isExpanded) triggerRef.current?.focus();
    setIsExpanded((current) => !current);
  };

  // root に付ける props を、ref・onBlur・onKeyDown に分けて返さない。閉じる条件を足すたびに、使う部品すべての root の行を直す必要が出るため
  const rootProps = { ref: rootRef, onBlur: handleBlur, onKeyDown: handleKeyDown };

  return { isExpanded, rootProps, triggerRef, collapse, collapseToTrigger, toggle };
}
