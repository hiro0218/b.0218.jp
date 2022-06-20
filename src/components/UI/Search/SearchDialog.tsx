import { forwardRef, MutableRefObject, useCallback } from 'react';

import { fadeIn, slideIn } from '@/ui/mixin';
import { styled } from '@/ui/styled';

import { SearchPanel } from './SearchPanel';

type RefProps = MutableRefObject<HTMLDialogElement>;

type Props = {
  closeDialog: () => void;
};

export const SearchDialog = forwardRef(function SearchDialog({ closeDialog }: Props, ref: RefProps) {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  return (
    <Dialog ref={ref} onClick={closeDialog} aria-modal>
      <div onClick={stopPropagation}>
        <SearchPanel />
      </div>
    </Dialog>
  );
});

const Dialog = styled.dialog`
  &[open] {
    padding: 0;
    animation: ${fadeIn} 0.4s, ${slideIn} 0.4s linear;
    border: none;
  }
`;
