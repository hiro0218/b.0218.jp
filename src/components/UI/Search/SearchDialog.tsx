import { forwardRef, MutableRefObject } from 'react';
import { createPortal } from 'react-dom';

import useIsClient from '@/hooks/useIsClient';
import { fadeIn, slideIn } from '@/ui/animation';
import { css, styled } from '@/ui/styled';

import { SearchPanel } from './SearchPanel';

type RefProps = MutableRefObject<HTMLDialogElement>;

type Props = {
  closeDialog: () => void;
};

export const SearchDialog = forwardRef(function SearchDialog({ closeDialog }: Props, ref: RefProps) {
  const isClient = useIsClient();

  if (!isClient) {
    return null;
  }

  return createPortal(
    <>
      <Overlay isOpen={!!ref.current?.open} onClick={closeDialog} />
      <Dialog ref={ref} aria-modal>
        <SearchPanel closeDialog={closeDialog} />
      </Dialog>
    </>,
    document.body,
  );
});

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  animation: ${fadeIn} 0.4s linear both;

  && {
    ${({ isOpen }) =>
      isOpen
        ? css`
            z-index: calc(var(--zIndex-search) - 1);
            opacity: 1;
            background-color: var(--overlay-backgrounds);
            inset: 0;
          `
        : css`
            opacity: 0;
          `}
  }
`;

const Dialog = styled.dialog`
  position: fixed;
  top: 25vh;

  &[open] {
    z-index: calc(var(--zIndex-search));
    padding: 0;
    animation: ${fadeIn} 0.4s, ${slideIn} 0.4s linear;
    border: none;
  }
`;
