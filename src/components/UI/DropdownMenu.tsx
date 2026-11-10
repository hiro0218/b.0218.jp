'use client';

import type { FocusEvent, MouseEvent, ReactNode } from 'react';
import { useId } from 'react';

import { IconButton } from '@/components/UI/IconButton';
import { useDisclosure } from '@/hooks/useDisclosure';

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
  const { isExpanded, rootRef, triggerRef, collapse, collapseToTrigger, handleKeyDown, toggle } = useDisclosure();
  const panelId = useId();

  // リンククリックで閉じてトリガーへ focus を戻す（Esc と同じ理由。閉じた後の focus 迷子を防ぐ）
  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('a')) return;

    collapseToTrigger();
  };

  // フォーカスがトリガーとパネルの外へ移ったら閉じる(Tab でパネルを通り過ぎても開いたままにしない)。
  // relatedTarget が無い場合(ウィンドウ切り替え、フォーカスできない場所のクリック)は閉じない。
  // 前者は戻ってきたときに状態を保つため、後者は useInteractOutside が受け持つため。移動先のフォーカスは奪い返さない。
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!(event.relatedTarget instanceof Node)) return;
    if (event.currentTarget.contains(event.relatedTarget)) return;
    collapse();
  };

  return (
    <Container onBlur={handleBlur} onKeyDown={handleKeyDown} ref={rootRef}>
      <IconButton
        aria-controls={panelId}
        aria-expanded={isExpanded}
        aria-label={triggerLabel}
        className={triggerAnchorStyle}
        data-active={isExpanded}
        onClick={toggle}
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
