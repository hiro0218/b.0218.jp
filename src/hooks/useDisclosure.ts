'use client';

import { useInteractOutside } from '@react-aria/interactions';
import { type KeyboardEvent, useCallback, useRef, useState } from 'react';

/**
 * ボタンで開閉する領域（disclosure）の開閉の状態と、閉じる操作（領域の外の操作・Esc）を受け持つ。
 * rootRef は、トリガーとパネルを含む要素に付ける。triggerRef は、トリガーのボタンに付ける。
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

  // フォーカスをクリックの移動に任せない。macOS の Safari・Firefox はクリックでボタンにフォーカスが当たらず、Esc をこの要素の中で受けられなくなるため
  const toggle = () => {
    if (!isExpanded) triggerRef.current?.focus();
    setIsExpanded((current) => !current);
  };

  return { isExpanded, rootRef, triggerRef, collapse, collapseToTrigger, handleKeyDown, toggle };
}
