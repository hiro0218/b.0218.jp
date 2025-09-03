import dynamic from 'next/dynamic';
import { type ForwardedRef, useId } from 'react';
import { createPortal } from 'react-dom';

import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled';
import { useSearchIntegration } from '../../hooks/useSearchIntegration';
import type { OnCloseDialogProps } from '../../types';
import { SEARCH_LABELS } from '../../utils/constants';

const SearchPanel = dynamic(() => import('../SearchPanel').then((module) => ({ default: module.SearchPanel })));
const SearchHeader = dynamic(() => import('../SearchHeader').then((module) => ({ default: module.SearchHeader })));
const Overlay = dynamic(() => import('@/components/UI/Overlay').then((module) => module.Overlay));

type Props = {
  closeDialog: OnCloseDialogProps;
  ref: ForwardedRef<HTMLDialogElement>;
};

export const SearchDialog = ({ closeDialog, ref }: Props) => {
  const isClient = useIsClient();
  const id = useId();
  const { searchPanelProps, searchHeaderProps } = useSearchIntegration({ closeDialog });

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <Dialog aria-describedby={`${id}-described`} aria-labelledby={`${id}-labelled`} aria-modal ref={ref}>
        <h2 className="sr-only" id={`${id}-labelled`}>
          {SEARCH_LABELS.searchTitle}
        </h2>
        <p className="sr-only" id={`${id}-described`}>
          {SEARCH_LABELS.searchDescription}
        </p>
        <SearchHeader {...searchHeaderProps} />
        <SearchPanel {...searchPanelProps} />
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
    animation:
      fadeIn 0.4s,
      slideIn 0.4s linear;
  }
`;
