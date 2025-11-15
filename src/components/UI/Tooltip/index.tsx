'use client';

import { useRef } from 'react';
import { useTooltip, useTooltipTrigger } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';
import { styled } from '@/ui/styled';

type TooltipProps = {
  text: string;
  position?: 'top' | 'bottom';
  children: React.ReactElement;
  delay?: number;
};

export const Tooltip = ({ text, position = 'bottom', children, delay = 500 }: TooltipProps) => {
  const state = useTooltipTriggerState({ delay });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const { triggerProps, tooltipProps } = useTooltipTrigger({ isDisabled: false }, state, triggerRef);

  const { tooltipProps: ariaTooltipProps } = useTooltip(tooltipProps, state);

  return (
    <TooltipContainer ref={triggerRef} {...triggerProps}>
      {children}
      {state.isOpen && (
        <TooltipContent data-position={position} data-visible={state.isOpen} ref={tooltipRef} {...ariaTooltipProps}>
          {text}
        </TooltipContent>
      )}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.span`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.span`
  position: absolute;
  left: 50%;
  z-index: var(--z-index-base);
  padding: var(--spacing-½) var(--spacing-1);
  font-size: var(--font-sizes-xs);
  line-height: var(--line-heights-md);
  color: var(--colors-dark-foregrounds);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  background-color: var(--colors-dark-backgrounds);
  border-radius: var(--radii-4);
  opacity: 0;
  transition:
    transform 0.1s linear,
    opacity 0.2s linear;

  &[data-position='top'] {
    bottom: calc(100% + var(--spacing-½));
    transform: translate(-50%, 100%);
  }

  &[data-position='bottom'] {
    top: calc(100% + var(--spacing-½));
    transform: translate(-50%, -100%);
  }

  &[data-visible='true'] {
    opacity: 1;
    transform: translate(-50%, 0%);
  }
`;
