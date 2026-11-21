'use client';

import { useTooltip, useTooltipTrigger } from '@react-aria/tooltip';
import { mergeProps } from '@react-aria/utils';
import { cloneElement, type HTMLAttributes, type ReactElement, useRef } from 'react';
import { useTooltipTriggerState } from 'react-stately';
import { styled } from '@/ui/styled';

type TooltipProps = {
  text: string;
  position?: 'top' | 'bottom';
  /** 焦点を取れる 1 つの要素。ホバーとフォーカスの props を、この要素へ渡す。Client Component の中で作った要素にする（Server Component が作った要素は lazy の node で届くことがあり、props を足せない） */
  children: ReactElement<HTMLAttributes<HTMLElement>>;
};

const SHOW_DELAY_MS = 500;

/**
 * ホバーとキーボードのフォーカスでテキストを表示するツールチップ。React Aria でアクセシビリティ対応済み。
 * @summary ホバーツールチップ
 */
export const Tooltip = ({ text, position = 'bottom', children }: TooltipProps) => {
  const state = useTooltipTriggerState({ delay: SHOW_DELAY_MS });
  const rootRef = useRef<HTMLSpanElement>(null);

  const { triggerProps, tooltipProps } = useTooltipTrigger({ isDisabled: false }, state, rootRef);

  const { tooltipProps: ariaTooltipProps } = useTooltip(tooltipProps, state);

  // トリガーの props を span に付けない。react-aria の useFocus は、自分自身へのフォーカスしか受けず、子のボタンにフォーカスが当たっても開かないため。
  // ref を子へ渡さない。useTooltipTrigger が ref を使うのは、Esc を受けるかの判定の ref.current の有無だけで、span で足りるため
  return (
    <Root ref={rootRef}>
      {cloneElement(children, mergeProps(children.props, triggerProps))}
      {state.isOpen ? (
        <TooltipContent data-position={position} {...ariaTooltipProps}>
          {text}
        </TooltipContent>
      ) : null}
    </Root>
  );
};

const Root = styled.span`
  position: relative;
  display: inline-block;
`;

// opacity / transform の transition を付けない。開いている間だけマウントする要素は、transition が最初のスタイル計算では走らず効かない（出すなら @starting-style か animation）
// pointer-events: none を付けない。ポインタを載せても開いたままにする（WCAG 1.4.13）には、ツールチップ自身がポインタを受ける必要があるため
const TooltipContent = styled.span`
  position: absolute;
  left: 50%;
  z-index: var(--z-index-base);
  padding: var(--spacing-75) var(--spacing-100);
  font-size: var(--font-sizes-xs);
  line-height: var(--line-heights-md);
  color: var(--colors-dark-foregrounds);
  white-space: nowrap;
  user-select: none;
  background-color: var(--colors-dark-backgrounds);
  border-radius: var(--radii-sm);
  transform: translate(-50%, 0%);

  &[data-position='top'] {
    bottom: calc(100% + var(--spacing-75));
  }

  &[data-position='bottom'] {
    top: calc(100% + var(--spacing-75));
  }
`;
