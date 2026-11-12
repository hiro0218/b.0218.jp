'use client';

import { useTooltip, useTooltipTrigger } from '@react-aria/tooltip';
import { useRef } from 'react';
import { useTooltipTriggerState } from 'react-stately';
import { styled } from '@/ui/styled';

type TooltipProps = {
  text: string;
  position?: 'top' | 'bottom';
  children: React.ReactElement;
};

const SHOW_DELAY_MS = 500;

/**
 * ホバーでテキストを表示するツールチップ。React Aria でアクセシビリティ対応済み。
 * @summary ホバーツールチップ
 */
export const Tooltip = ({ text, position = 'bottom', children }: TooltipProps) => {
  const state = useTooltipTriggerState({ delay: SHOW_DELAY_MS });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const { triggerProps, tooltipProps } = useTooltipTrigger({ isDisabled: false }, state, triggerRef);

  const { tooltipProps: ariaTooltipProps } = useTooltip(tooltipProps, state);

  return (
    <TooltipContainer ref={triggerRef} {...triggerProps}>
      {children}
      {state.isOpen ? (
        <TooltipContent data-position={position} {...ariaTooltipProps}>
          {text}
        </TooltipContent>
      ) : null}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.span`
  position: relative;
  display: inline-block;
`;

// opacity / transform の transition を付けない。開いている間だけマウントする要素は、transition が最初のスタイル計算では走らず効かない（出すなら @starting-style か animation）
const TooltipContent = styled.span`
  position: absolute;
  left: 50%;
  z-index: var(--z-index-base);
  padding: var(--spacing-75) var(--spacing-100);
  font-size: var(--font-sizes-xs);
  line-height: var(--line-heights-md);
  color: var(--colors-dark-foregrounds);
  white-space: nowrap;
  pointer-events: none;
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
