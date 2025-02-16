import dynamic from 'next/dynamic';
import { type ForwardedRef, useId } from 'react';
import { createPortal } from 'react-dom';

import useIsClient from '@/hooks/useIsClient';
import { styled } from '@/ui/styled/static';

import type { onCloseDialogProps } from './type';

const SearchPanel = dynamic(() => import('./SearchPanel').then((module) => module.SearchPanel));
const Overlay = dynamic(() => import('./Overlay').then((module) => module.Overlay));

type Props = {
  closeDialog: onCloseDialogProps;
  ref: ForwardedRef<HTMLDialogElement>;
};

export const SearchDialog = ({ closeDialog, ref }: Props) => {
  const isClient = useIsClient();
  const id = useId();

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <Dialog aria-describedby={`${id}-described`} aria-labelledby={`${id}-labelled`} aria-modal ref={ref}>
        <h2 className="sr-only" id={`${id}-labelled`}>
          記事検索
        </h2>
        <p className="sr-only" id={`${id}-described`}>
          記事のタイトルから検索することができます
        </p>
        <SearchPanel closeDialog={closeDialog} />
      </Dialog>
      <Overlay onClick={closeDialog} />
    </>,
    document.body,
  );
};

const Dialog = styled.dialog`
  position: fixed;
  top: 25vh;
  border-radius: var(--border-radius-12);
  isolation: isolate;
  content-visibility: hidden;

  &[open] {
    z-index: var(--zIndex-search);
    padding: 0;
    border: none;
    animation:
      fadeIn 0.4s,
      slideIn 0.4s linear;
    content-visibility: visible;
  }
`;
