import {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';

import { keyframes, styled } from '@/ui/styled';

type RefProps = React.LegacyRef<HTMLDialogElement>;

type Props = {
  ref: MutableRefObject<HTMLDialogElement>;
  closeDialog: () => void;
  children: ReactNode;
};

const ESC_KEY_CODE = 27;

export const SearchDialog = forwardRef(function SearchDialog({ closeDialog, children }: Props, ref: RefProps) {
  const stopPropagation = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
  }, []);

  const escFunction = useCallback(
    (event) => {
      if (event.keyCode === ESC_KEY_CODE) {
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
      <div onClick={stopPropagation}>{children}</div>
    </Dialog>
  );
});

const slideIn = keyframes`
  0% {
    transform: translateY(400px);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(-30px);
    animation-timing-function: ease-in;
  }
  80% {
    transform: translateY(10px);
    animation-timing-function: ease-out;
  }
  100% {
    transform: translateY(0);
    animation-timing-function: ease-in;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Dialog = styled.dialog`
  &[open] {
    padding: 0;
    animation: ${fadeIn} 0.4s, ${slideIn} 0.4s linear;
    border: none;
  }
`;
