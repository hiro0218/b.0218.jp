'use client';

import { useInteractOutside } from '@react-aria/interactions';
import type { FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useId, useRef, useState } from 'react';

import { IconButton } from '@/components/UI/IconButton';

import { Container, Content, triggerAnchorStyle } from './DropdownMenu/styles';

export type DropdownMenuProps = {
  /** メニュートリガーに表示するコンテンツ（アイコン等） */
  title: ReactNode;
  /** トリガーの aria-label。アイコン主体のトリガーで操作意図を読み上げできるよう必須にする */
  triggerLabel: string;
  /** メニュー内のリンク要素 */
  children: ReactNode;
};

/**
 * ARIA menu パターン（role="menu"/menuitem）にしない。中身はコマンド選択ではなくリンクの一覧のため、disclosure パターンにする。
 * React Aria の useMenuItem を div に当てて <a> を包む構造にしない。この構造では、menuitem 上の Enter でリンクが開かない。
 * @summary クリック開閉ドロップダウンメニュー（disclosure パターン）
 */
export function DropdownMenu({ title, triggerLabel, children }: DropdownMenuProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // パネル外クリックで閉じる（開いている場合のみハンドラを設定）
  useInteractOutside({
    ref: containerRef,
    isDisabled: !isExpanded,
    onInteractOutside: () => setIsExpanded(false),
  });

  // 展開中のみ Esc キーで閉じ、トリガーへ focus を戻す
  // 閉じたあとにフォーカスをパネルの中へ残さない。閉じたパネルは inert になる。フェードが終わると display: none になり、フォーカスは body へ落ちる。
  // document の keydown は使わない。使うと、検索ダイアログなど他の dialog の Esc まで拾い、除外する特例が要る
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isExpanded || event.key !== 'Escape') return;

    setIsExpanded(false);
    triggerRef.current?.focus();
  };

  // クリックでのフォーカス移動に任せず、開くときにトリガーへフォーカスを置く。macOS の Safari・Firefox はクリックでボタンにフォーカスが当たらず、Esc をこの要素の中で受けられなくなる
  const handleTriggerClick = () => {
    if (!isExpanded) triggerRef.current?.focus();
    setIsExpanded((current) => !current);
  };

  // リンククリックで閉じてトリガーへ focus を戻す（Esc と同じ理由。閉じた後の focus 迷子を防ぐ）
  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('a')) return;

    setIsExpanded(false);
    triggerRef.current?.focus();
  };

  // フォーカスがトリガーとパネルの外へ移ったら閉じる(Tab でパネルを通り過ぎても開いたままにしない)。
  // relatedTarget が無い場合(ウィンドウ切り替え、フォーカスできない場所のクリック)は閉じない。
  // 前者は戻ってきたときに状態を保つため、後者は useInteractOutside が受け持つため。移動先のフォーカスは奪い返さない。
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.relatedTarget instanceof Node)) return;
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsExpanded(false);
  };

  return (
    <Container onBlur={handleBlur} onKeyDown={handleKeyDown} ref={containerRef}>
      <IconButton
        aria-controls={panelId}
        aria-expanded={isExpanded}
        aria-label={triggerLabel}
        className={triggerAnchorStyle}
        data-active={isExpanded}
        onClick={handleTriggerClick}
        ref={triggerRef}
      >
        {title}
      </IconButton>
      <Content
        data-expanded={isExpanded}
        id={panelId}
        // 閉じるフェード中もボックスが残るので、その間に操作・フォーカスされないようにする
        inert={isExpanded ? undefined : true}
        onClick={handlePanelClick}
      >
        {children}
      </Content>
    </Container>
  );
}
