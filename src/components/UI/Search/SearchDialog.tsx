import dynamic from 'next/dynamic';
import { forwardRef, MutableRefObject, useId } from 'react';
import { createPortal } from 'react-dom';

import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import useIsClient from '@/hooks/useIsClient';
import { fadeIn, slideIn } from '@/ui/animation';
import { styled } from '@/ui/styled';

const SearchPanel = dynamic(() => import('./SearchPanel').then((module) => module.SearchPanel));
const Overlay = dynamic(() => import('./Overlay').then((module) => module.Overlay));

type RefProps = MutableRefObject<HTMLDialogElement>;

type Props = {
  isActive: boolean;
  closeDialog: () => void;
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
      <Dialog ref={ref} aria-modal aria-labelledby={labelledbyId} aria-describedby={describedbyId}>
        <ScreenReaderOnlyText as="h2" id={labelledbyId} text="記事検索" />
        <ScreenReaderOnlyText as="p" id={describedbyId} text="記事のタイトルから検索することができます" />
        <SearchPanel closeDialog={closeDialog} />
      </Dialog>
      <Overlay isActive={isActive} onClick={closeDialog} />
    </>,
    document.body,
  );
});

const Dialog = styled.dialog`
  position: fixed;
  isolation: isolate;
  top: 25vh;

  &[open] {
    z-index: var(--zIndex-search);
    padding: 0;
    border: none;
    animation: ${fadeIn} 0.4s, ${slideIn} 0.4s linear;
  }
`;
