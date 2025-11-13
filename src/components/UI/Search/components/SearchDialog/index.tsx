'use client';

import { type ForwardedRef, useId, useRef } from 'react';
import { FocusScope, useInteractOutside } from 'react-aria';
import { createPortal } from 'react-dom';

import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled';
import { useSearchIntegration } from '../../hooks/useSearchIntegration';
import type { OnCloseDialogProps } from '../../types';
import { SEARCH_LABELS } from '../../utils/constants';
import { SearchHeader } from '../SearchHeader';
import { SearchPanel } from '../SearchPanel';

type Props = {
  onCloseAction: OnCloseDialogProps;
  isClosing?: boolean;
  ref: ForwardedRef<HTMLDialogElement>;
};

export const SearchDialog = ({ onCloseAction, isClosing, ref }: Props) => {
  const isClient = useIsClient();
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    results,
    query,
    focusedIndex,
    onSearchInput,
    setResultRef,
    closeDialog: handleCloseDialog,
    keyboardProps,
  } = useSearchIntegration({
    closeDialog: onCloseAction,
    dialogRef: ref as React.RefObject<HTMLDialogElement>,
  });

  // Dialog外のクリックでダイアログを閉じる
  useInteractOutside({
    ref: containerRef,
    onInteractOutside: handleCloseDialog,
  });

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <BackgroundOverlay />
      <FocusScope autoFocus contain restoreFocus>
        <DialogContainer ref={containerRef}>
          <Dialog
            {...keyboardProps}
            aria-describedby={`${id}-described`}
            aria-labelledby={`${id}-labelled`}
            aria-modal="true"
            data-closing={isClosing}
            ref={ref}
          >
            <h2 className="sr-only" id={`${id}-labelled`}>
              {SEARCH_LABELS.searchTitle}
            </h2>
            <p className="sr-only" id={`${id}-described`}>
              {SEARCH_LABELS.searchDescription}
            </p>
            <SearchHeader onKeyUp={onSearchInput} searchQuery={query} />
            <SearchPanel
              focusedIndex={focusedIndex}
              onLinkClick={handleCloseDialog}
              results={results}
              searchQuery={query}
              setResultRef={setResultRef}
            />
          </Dialog>
        </DialogContainer>
      </FocusScope>
    </>,
    document.body,
  );
};

const BackgroundOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-index-overlay);
  background-color: var(--colors-overlay-backgrounds);
  pointer-events: none;
`;

const DialogContainer = styled.div`
  position: relative;
  z-index: calc(var(--z-index-overlay) + 1);
`;

const Dialog = styled.dialog`
  position: fixed;
  top: 25vh;
  border-radius: var(--radii-4);
  isolation: isolate;
  opacity: 0;
  transition: top 0.4s ease-out;

  &[open] {
    padding: 0;
    border: none;
    opacity: 1;
    animation: zoomIn 0.2s ease-out;
  }

  &[open][data-closing='true'] {
    animation: zoomOut 0.2s ease-out forwards;
  }
`;
