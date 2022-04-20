import { useCallback, useRef } from 'react';

export const useModal = () => {
  const ref = useRef<HTMLDialogElement>(null);
  const refStyleOverflow = useRef<CSSStyleDeclaration["overflow"]>(
    typeof window !== 'undefined' ? window.getComputedStyle(document.body).overflow : ''
  );

  const openDialog = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref.current?.showModal();
    document.body.style.overflow = "hidden";
  }, []);

  const closeDialog = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ref.current?.close();
    document.body.style.overflow = refStyleOverflow.current;
  }, []);

  return { ref, openDialog, closeDialog };
};

