import dynamic from 'next/dynamic';
import { forwardRef, type MutableRefObject, useId } from 'react';
import { createPortal } from 'react-dom';

import useIsClient from '@/hooks/useIsClient';
import { fadeIn, slideIn } from '@/ui/animation';
import { styled } from '@/ui/styled';

import type { onCloseDialogProps } from './type';

type RefProps = MutableRefObject<HTMLDialogElement>;

const SrOnly = dynamic(() =>
  import('@/components/UI/ScreenReaderOnlyText').then((module) => module.ScreenReaderOnlyText),
);
const SearchPanel = dynamic(() => import('./SearchPanel').then((module) => module.SearchPanel));
const Overlay = dynamic(() => import('./Overlay').then((module) => module.Overlay));

type Props = {
  closeDialog: onCloseDialogProps;
};

export const SearchDialog = forwardRef(function SearchDialog({ closeDialog }: Props, ref: RefProps) {
  const isClient = useIsClient();
  const id = useId();

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <Dialog aria-describedby={`${id}-described`} aria-labelledby={`${id}-labelled`} aria-modal ref={ref}>
        <SrOnly as="h2" id={`${id}-labelled`} text="記事検索" />
        <SrOnly as="p" id={`${id}-described`} text="記事のタイトルから検索することができます" />
        <SearchPanel closeDialog={closeDialog} />
      </Dialog>
      <Overlay onClick={closeDialog} />
    </>,
    document.body,
  );
});

const Dialog = styled.dialog`
  position: fixed;
  top: 25vh;
  isolation: isolate;
  border-radius: var(--border-radius-12);

  &[open] {
    z-index: var(--zIndex-search);
    padding: 0;
    border: none;
    animation:
      ${fadeIn} 0.4s,
      ${slideIn} 0.4s linear;
  }
`;
