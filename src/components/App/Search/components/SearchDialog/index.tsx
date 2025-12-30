'use client';

import { type ForwardedRef, useId } from 'react';
import { FocusScope } from 'react-aria';
import { createPortal } from 'react-dom';

import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled';
import { useSearchFacade } from '../../hooks/useSearchFacade';
import type { OnCloseDialogProps } from '../../types';
import { SEARCH_LABELS } from '../constants';
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

  const search = useSearchFacade({
    onClose: onCloseAction,
    dialogRef: ref as React.RefObject<HTMLDialogElement>,
  });

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      search.actions.close();
    }
  };

  if (!isClient) {
    return null;
  }

  return createPortal(
    <FocusScope autoFocus contain restoreFocus>
      <Dialog
        {...search.ui.containerProps}
        aria-describedby={`${id}-described`}
        aria-labelledby={`${id}-labelled`}
        aria-modal="true"
        data-closing={isClosing}
        onClick={handleBackdropClick}
        ref={ref}
      >
        <h2 className="sr-only" id={`${id}-labelled`}>
          {SEARCH_LABELS.searchTitle}
        </h2>
        <p className="sr-only" id={`${id}-described`}>
          {SEARCH_LABELS.searchDescription}
        </p>
        <SearchHeader {...search.ui.inputProps} searchQuery={search.query} />
        <SearchPanel
          focusedIndex={search.focusedIndex}
          onLinkClick={search.actions.close}
          results={search.results}
          searchQuery={search.query}
          setResultRef={search.ui.setResultRef}
        />
      </Dialog>
    </FocusScope>,
    document.body,
  );
};

const Dialog = styled.dialog`
  position: fixed;
  top: 0;
  max-width: 90vw;
  max-height: 80vh;
  padding: 0;
  border: none;
  border-radius: var(--radii-4);
  isolation: isolate;

  &:not([open]) {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
  }

  &[open] {
    visibility: visible;
    pointer-events: auto;
    opacity: 1;
    animation: zoomIn 0.2s var(--easings-ease-out-expo);
  }

  &[open][data-closing='true'] {
    animation: zoomOut 0.2s var(--easings-ease-out-expo) forwards;
  }

  &::backdrop {
    cursor: pointer;
    background-color: var(--colors-overlay-backgrounds);
    transition:
      background-color 0.2s var(--easings-ease-out-expo),
      opacity 0.2s var(--easings-ease-out-expo);
  }

  &[data-closing='true']::backdrop {
    opacity: 0;
  }
`;
