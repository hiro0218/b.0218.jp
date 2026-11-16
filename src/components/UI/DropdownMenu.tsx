'use client';

import type { MouseEvent, ReactNode } from 'react';
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
  const { isExpanded, rootProps, triggerRef, collapseToTrigger, toggle } = useDisclosure();
  const panelId = useId();

  // リンククリックで閉じてトリガーへ focus を戻す（Esc と同じ理由。閉じた後の focus 迷子を防ぐ）
  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('a')) return;

    collapseToTrigger();
  };

  return (
    <Container {...rootProps}>
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
