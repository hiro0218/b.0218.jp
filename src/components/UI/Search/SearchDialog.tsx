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
const Overlay = dynamic(() => import('@/components/UI/Overlay').then((module) => module.Overlay));

type Props = {
  isActive: boolean;
  closeDialog: onCloseDialogProps;
};

export const SearchDialog = forwardRef(function SearchDialog({ isActive, closeDialog }: Props, ref: RefProps) {
  const isClient = useIsClient();
  const labelledbyId = useId();
  const describedbyId = useId();

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <Dialog aria-describedby={describedbyId} aria-labelledby={labelledbyId} aria-modal ref={ref}>
        <SrOnly as="h2" id={labelledbyId} text="記事検索" />
        <SrOnly as="p" id={describedbyId} text="記事のタイトルから検索することができます" />
        <SearchPanel closeDialog={closeDialog} />
      </Dialog>
      <Overlay isActive={isActive} onClick={closeDialog} />
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
    animation: ${fadeIn} 0.4s, ${slideIn} 0.4s linear;
  }
`;
