'use client';

import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { type RefObject, useId } from 'react';
import { createPortal } from 'react-dom';

import { Container } from '@/components/UI/Layout';
import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled';
import { SEARCH_LABELS } from '../constants';
import { useSearch } from '../hooks/useSearch';
import { SearchHeader } from '../SearchHeader';
import { SearchPanel } from '../SearchPanel';

type Props = {
  onCloseAction: () => void;
  isClosing?: boolean;
  dialogRef: RefObject<HTMLDialogElement>;
};

export const SearchDialog = ({ onCloseAction, isClosing, dialogRef }: Props) => {
  const isClient = useIsClient();
  const id = useId();
  const labelledId = `${id}-labelled`;
  const describedId = `${id}-described`;

  const search = useSearch({
    onClose: onCloseAction,
    dialogRef,
  });

  const { dialogProps } = useDialog(
    {
      'aria-labelledby': labelledId,
      'aria-describedby': describedId,
    },
    dialogRef,
  );

  const mergedDialogProps = mergeProps(dialogProps, search.containerProps);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      search.close();
    }
  };

  if (!isClient) {
    return null;
  }

  return createPortal(
    <FocusScope autoFocus contain restoreFocus>
      <Dialog {...mergedDialogProps} data-closing={isClosing} onClick={handleBackdropClick} ref={dialogRef}>
        <h2 className="sr-only" id={labelledId}>
          {SEARCH_LABELS.searchTitle}
        </h2>
        <p className="sr-only" id={describedId}>
          {SEARCH_LABELS.searchDescription}
        </p>
        <Container size="default" space={false}>
          <SearchHeader {...search.inputProps} searchQuery={search.query} />
          <SearchPanel
            focusedIndex={search.focusedIndex}
            onLinkClick={search.close}
            results={search.results}
            searchQuery={search.query}
            setResultRef={search.setResultRef}
          />
        </Container>
      </Dialog>
    </FocusScope>,
    document.body,
  );
};

const Dialog = styled.dialog`
  position: fixed;
  top: 0;
  width: clamp(16rem, 90vw, 64rem);
  max-height: 80vh;
  padding: 0;
  overflow: clip;
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
