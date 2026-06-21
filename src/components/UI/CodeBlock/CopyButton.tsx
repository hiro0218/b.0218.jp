'use client';

import { CheckIcon, ClipboardDocumentIcon, NoSymbolIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';

import { IconSwap, type IconSwapActiveIcon } from '@/components/UI/IconSwap';
import { useClipboardCopy } from '@/hooks/useClipboardCopy';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';

type CopyState = 'idle' | 'copying' | 'copied' | 'failed' | 'unsupported';
type CopyFeedbackState = Extract<CopyState, 'copied' | 'failed' | 'unsupported'>;

const FEEDBACK_TIMEOUT_MS = 2000;

const COPY_LABELS: Record<CopyState, string> = {
  idle: 'コードをコピー',
  copying: 'コピー中',
  copied: 'コピーしました',
  failed: 'コピーに失敗しました',
  unsupported: 'このブラウザはコピーに未対応',
};

const COPY_FEEDBACK_ICONS = {
  copied: CheckIcon,
  failed: XMarkIcon,
  unsupported: NoSymbolIcon,
} satisfies Record<CopyFeedbackState, typeof CheckIcon>;

function isCopyFeedbackState(state: CopyState): state is CopyFeedbackState {
  return state === 'copied' || state === 'failed' || state === 'unsupported';
}

function getCopyFeedbackIcon(state: CopyState) {
  return isCopyFeedbackState(state) ? COPY_FEEDBACK_ICONS[state] : CheckIcon;
}

function getCodeText(button: HTMLButtonElement | null) {
  const codeBlock = button?.closest('[data-code-block]');
  return codeBlock?.querySelector('pre')?.textContent ?? '';
}

export function CopyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<CopyState>('idle');
  const { copyText } = useClipboardCopy();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const handleCopy = async () => {
    if (state === 'copying' || state === 'unsupported') return;

    const text = getCodeText(buttonRef.current);
    if (!text) return;

    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setState('copying');

    const result = await copyText(text);
    if (!isMountedRef.current) return;

    if (result.status === 'unsupported') {
      setState('unsupported');
      return;
    }

    setState(result.status === 'copied' ? 'copied' : 'failed');

    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      if (isMountedRef.current) setState('idle');
    }, FEEDBACK_TIMEOUT_MS);
  };

  const FeedbackIcon = getCopyFeedbackIcon(state);
  const showFeedbackIcon = isCopyFeedbackState(state);
  const activeIcon: IconSwapActiveIcon = showFeedbackIcon ? 'secondary' : 'primary';
  const announcement = showFeedbackIcon ? COPY_LABELS[state] : '';

  return (
    <>
      <Button
        aria-disabled={state === 'copying' || state === 'unsupported' || undefined}
        aria-label={COPY_LABELS[state]}
        data-slot="copy-button"
        data-state={state}
        onClick={handleCopy}
        ref={buttonRef}
        type="button"
      >
        <IconSwap
          activeIcon={activeIcon}
          primaryIcon={<ClipboardDocumentIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
          secondaryIcon={<FeedbackIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
        />
      </Button>
      <span aria-live="polite" className="sr-only" role="status">
        {announcement}
      </span>
    </>
  );
}

const Button = styled.button`
  position: absolute;
  top: var(--spacing-1);
  right: var(--spacing-1);
  display: grid;
  place-items: center;
  width: var(--sizes-touch-target);
  height: var(--sizes-touch-target);
  color: var(--colors-gray-700);
  cursor: pointer;
  background-color: var(--colors-white);
  border: var(--border-widths-thin) solid var(--colors-gray-a-300);
  border-radius: var(--radii-sm);
  opacity: 0;
  transition:
    background-color var(--transition-normal),
    color var(--transition-normal);

  &:hover {
    background-color: var(--colors-gray-50);
  }

  &:focus-visible {
    outline: 0;
    box-shadow: 0 0 0 var(--border-widths-medium) var(--colors-focus-ring);
    opacity: 1;
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (hover: none) {
    opacity: 1;
  }

  &[data-state='copied'] {
    color: var(--colors-grass-1200);
  }

  &[data-state='failed'] {
    color: var(--colors-red-1200);
  }

  &[data-state='unsupported'] {
    color: var(--colors-gray-500);
  }
`;
