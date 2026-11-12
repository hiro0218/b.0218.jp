'use client';

import { CopyIcon } from '@phosphor-icons/react';

import { useRef } from 'react';

import { CopyFeedbackIcon } from '@/components/UI/CopyFeedbackIcon';
import { isCopyResultState, useClipboardCopy } from '@/hooks/useClipboardCopy';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { styled } from '@/ui/styled';

function getCodeText(button: HTMLButtonElement | null) {
  const codeBlock = button?.closest('[data-code-block]');
  return codeBlock?.querySelector('pre')?.textContent ?? '';
}

export function CopyButton() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { state, label, copy } = useClipboardCopy('コードをコピー');

  const handleCopy = () => {
    const text = getCodeText(buttonRef.current);
    if (text) copy(text);
  };

  const announcement = isCopyResultState(state) ? label : '';

  return (
    <>
      <Button
        aria-disabled={state === 'copying' || state === 'unsupported' || undefined}
        aria-label={label}
        // data-slot を外さない。CodeBlock.tsx の hover の規則が、この属性でボタンを選んで表示にするため（外すと、マウスでボタンが出なくなる）
        data-slot="copy-button"
        onClick={handleCopy}
        ref={buttonRef}
        type="button"
      >
        <CopyFeedbackIcon
          idleIcon={<CopyIcon height={ICON_SIZE_SM} weight="duotone" width={ICON_SIZE_SM} />}
          state={state}
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
  top: var(--spacing-100);
  right: var(--spacing-100);
  display: grid;
  place-items: center;
  width: var(--spacing-500);
  min-width: var(--tap-target);
  height: var(--spacing-500);
  min-height: var(--tap-target);
  color: var(--colors-gray-700);
  cursor: pointer;
  background-color: var(--colors-white);
  border: var(--border-widths-thin) solid var(--colors-gray-a-300);
  border-radius: var(--radii-sm);
  opacity: 0;
  transition: background-color var(--transition-normal);

  &:hover {
    background-color: var(--colors-gray-50);
  }

  &:focus-visible {
    outline: var(--border-widths-medium) solid transparent;
    outline-offset: var(--border-widths-medium);
    box-shadow: var(--focus-ring-shadow);
    opacity: 1;
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (hover: none) {
    opacity: 1;
  }
`;
