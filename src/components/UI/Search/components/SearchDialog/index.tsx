import dynamic from 'next/dynamic';
import { type ForwardedRef, useId } from 'react';
import { createPortal } from 'react-dom';

import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled';
import { useSearchIntegration } from '../../hooks/useSearchIntegration';
import type { OnCloseDialogProps } from '../../types';
import { SEARCH_LABELS } from '../../utils/constants';

const SearchPanel = dynamic(() => import('../SearchPanel').then((mod) => ({ default: mod.SearchPanel })), {
  ssr: false,
});
const SearchHeader = dynamic(() => import('../SearchHeader').then((mod) => ({ default: mod.SearchHeader })), {
  ssr: false,
});
const Overlay = dynamic(() => import('@/components/UI/Overlay').then((mod) => mod.Overlay), { ssr: false });

type Props = {
  closeDialog: OnCloseDialogProps;
  isClosing?: boolean;
  ref: ForwardedRef<HTMLDialogElement>;
};

export const SearchDialog = ({ closeDialog, isClosing, ref }: Props) => {
  const isClient = useIsClient();
  const id = useId();

  const { results, query, focusedIndex, onSearchInput, setResultRef } = useSearchIntegration({
    closeDialog,
  });

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <Dialog
        aria-describedby={`${id}-described`}
        aria-labelledby={`${id}-labelled`}
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
          closeDialog={closeDialog}
          focusedIndex={focusedIndex}
          results={results}
          searchQuery={query}
          setResultRef={setResultRef}
        />
      </Dialog>
      <Overlay onClick={closeDialog} />
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
  }

  &[open][data-closing='true'] {
    animation: zoomOut 0.2s forwards;
  }
`;
