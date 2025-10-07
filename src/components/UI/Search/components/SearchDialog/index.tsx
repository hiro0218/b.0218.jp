import { type ForwardedRef, useId } from 'react';
import { FocusScope } from 'react-aria';
import { createPortal } from 'react-dom';

import { Overlay } from '@/components/UI/Overlay';
import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled';
import { useSearchIntegration } from '../../hooks/useSearchIntegration';
import type { OnCloseDialogProps } from '../../types';
import { SEARCH_LABELS } from '../../utils/constants';
import { SearchHeader } from '../SearchHeader';
import { SearchPanel } from '../SearchPanel';

type Props = {
  closeDialog: OnCloseDialogProps;
  isClosing?: boolean;
  ref: ForwardedRef<HTMLDialogElement>;
};

export const SearchDialog = ({ closeDialog, isClosing, ref }: Props) => {
  const isClient = useIsClient();
  const id = useId();

  const {
    results,
    query,
    focusedIndex,
    onSearchInput,
    setResultRef,
    closeDialog: handleCloseDialog,
  } = useSearchIntegration({
    closeDialog,
    dialogRef: ref as React.RefObject<HTMLDialogElement>,
  });

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <FocusScope autoFocus contain restoreFocus>
        <Dialog
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
          <SearchPanel focusedIndex={focusedIndex} results={results} searchQuery={query} setResultRef={setResultRef} />
        </Dialog>
      </FocusScope>
      <Overlay onClick={handleCloseDialog} />
    </>,
    document.body,
  );
};

const Dialog = styled.dialog`
  position: fixed;
  top: 25vh;
  border-radius: var(--radii-4);
  isolation: isolate;
  opacity: 0;
  transition: top 0.4s;

  &[open] {
    z-index: var(--z-index-search);
    padding: 0;
    border: none;
    opacity: 1;
    animation: zoomIn 0.2s;
    will-change: transform, opacity;
  }

  &[open][data-closing='true'] {
    animation: zoomOut 0.2s forwards;
  }
`;
