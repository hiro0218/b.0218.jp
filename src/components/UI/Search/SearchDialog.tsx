import { forwardRef, MutableRefObject, useCallback, useEffect } from 'react';

import { fadeIn, slideIn } from '@/ui/mixin';
import { styled } from '@/ui/styled';

import { SearchPanel } from './SearchPanel';

type RefProps = React.LegacyRef<HTMLDialogElement>;

type Props = {
  ref: MutableRefObject<HTMLDialogElement>;
  closeDialog: () => void;
};

export const SearchDialog = forwardRef(function SearchDialog({ closeDialog }: Props, ref: RefProps) {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDialog();
      }
    },
    [closeDialog],
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction);

    return () => {
      document.removeEventListener('keydown', escFunction);
    };
  }, [escFunction]);

  return (
    <Dialog ref={ref} onClick={closeDialog}>
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
