'use client';

import { useOverlay } from '@react-aria/overlays';
import { useRef } from 'react';
import { styled } from '@/ui/styled';

type Props = {
  onCloseAction: () => void;
  isOpen?: boolean;
};

export function Overlay({ onCloseAction, isOpen = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose: onCloseAction,
      isDismissable: true,
      shouldCloseOnBlur: true,
    },
    ref,
  );

  return <Div {...overlayProps} onClick={onCloseAction} ref={ref} />;
}

const Div = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-index-overlay);
  visibility: hidden;
  background-color: var(--colors-overlay-backgrounds);
  isolation: isolate;
  opacity: 0;
  transition:
    opacity var(--transition-slow),
    visibility var(--transition-slow);
  animation: fadeIn var(--transition-slow);

  [data-is-zoom-image='true'] ~ &,
  dialog[open] ~ & {
    visibility: visible;
    content-visibility: hidden;
    opacity: 1;
  }
`;
