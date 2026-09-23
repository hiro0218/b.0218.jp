'use client';

import { useInteractOutside } from '@react-aria/interactions';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

import { IconButton } from '@/components/UI/IconButton';

import { Container, Content, triggerAnchorStyle } from './DropdownMenu/styles';

type MenuPosition = 'left' | 'right';

export type DropdownMenuProps = {
  /** メニュートリガーに表示するコンテンツ（アイコン等） */
  title: ReactNode;
  /** トリガーの aria-label。アイコン主体のトリガーで操作意図を読み上げできるよう必須にする */
  triggerLabel: string;
  /** メニュー内のリンク要素 */
  children: ReactNode;
  /** 既定の展開方向。Anchor Positioning 対応ブラウザでは、画面からはみ出す場合に左右・上下を自動で反転する */
  menuHorizontalPosition?: MenuPosition;
};

/**
 * クリック操作で開閉するドロップダウンメニュー。
 * 中身はコマンド選択ではなくリンクの一覧なので、ARIA menu パターン（role="menu"/menuitem）ではなく
 * disclosure パターン（トリガーの aria-expanded/aria-controls + 素の <a> を並べたパネル）で実装する。
 * （menu パターンでは menuitem が <a> を包む構造になり、menuitem 上の Enter でリンクが開かない）
 * @summary クリック開閉ドロップダウンメニュー（disclosure パターン）
 */
export function DropdownMenu({ title, triggerLabel, children, menuHorizontalPosition = 'right' }: DropdownMenuProps) {
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
  // （閉じるとパネルが visibility: hidden になり、中に focus が残っていると body に落ちるため）
  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      // 検索ダイアログなど他の <dialog> 内で発生した Esc はそちら側の close に委ね、背後のパネルまで閉じない
      if ((event.target as HTMLElement | null)?.closest('dialog[open]')) return;

      setIsExpanded(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // リンククリックで閉じてトリガーへ focus を戻す（Esc と同じ理由。閉じた後の focus 迷子を防ぐ）
  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('a')) return;

    setIsExpanded(false);
    triggerRef.current?.focus();
  };

  return (
    <Container ref={containerRef}>
      <IconButton
        aria-controls={panelId}
        aria-expanded={isExpanded}
        aria-label={triggerLabel}
        className={triggerAnchorStyle}
        data-active={isExpanded}
        onClick={() => setIsExpanded((current) => !current)}
        ref={triggerRef}
      >
        {title}
      </IconButton>
      <Content
        data-expanded={isExpanded}
        data-position={menuHorizontalPosition}
        id={panelId}
        onClick={handlePanelClick}
      >
        {children}
      </Content>
    </Container>
  );
}
