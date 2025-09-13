import { useRef } from 'react';
import { useInteractOutside } from 'react-aria';

import { useBoolean } from '@/hooks/useBoolean';

export const useDropdownMenu = () => {
  const { value: isOpen, toggle: toggleDropdownMenuContent, setFalse: closeMenu } = useBoolean(false);
  const ref = useRef<HTMLDivElement>(null);

  useInteractOutside({
    ref: ref,
    onInteractOutside: () => {
      if (isOpen) {
        closeMenu();
      }
    },
  });

  return {
    isOpen,
    ref,
    toggleDropdownMenuContent,
  };
};
