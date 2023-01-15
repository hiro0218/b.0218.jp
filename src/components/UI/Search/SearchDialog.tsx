import { forwardRef, MutableRefObject, useId } from 'react';
import { createPortal } from 'react-dom';

import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import useIsClient from '@/hooks/useIsClient';
import { fadeIn, slideIn } from '@/ui/animation';
import { styled } from '@/ui/styled';

import { SearchPanel } from './SearchPanel';

type RefProps = MutableRefObject<HTMLDialogElement>;

type Props = {
  closeDialog: () => void;
};

export const SearchDialog = forwardRef(function SearchDialog({ closeDialog }: Props, ref: RefProps) {
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
      <Overlay onClick={closeDialog} />
    </>,
    document.body,
  );
});

const Dialog = styled.dialog`
  position: fixed;
  isolation: isolate;
  top: 25vh;

  &[open] {
    z-index: calc(var(--zIndex-search));
    padding: 0;
    animation: ${fadeIn} 0.4s, ${slideIn} 0.4s linear;
    border: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  isolation: isolate;
  animation: ${fadeIn} 0.4s linear both;
  opacity: 0;

  dialog[open] + & {
    z-index: calc(var(--zIndex-search) - 1);
    opacity: 1;
    background-color: var(--overlay-backgrounds);
    inset: 0;
  }
`;
