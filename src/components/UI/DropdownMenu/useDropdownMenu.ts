import { useRef, useState } from 'react';
import { useInteractOutside } from 'react-aria';

export const useDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /**
   * メニューの開閉を切り替える
   */
  const toggleDropdownMenuContent = () => {
    setIsOpen((prev) => !prev);
  };

  useInteractOutside({
    ref: ref,
    onInteractOutside: () => {
      if (isOpen) {
        setIsOpen(false);
      }
    },
  });

  return {
    isOpen,
    ref,
    toggleDropdownMenuContent,
  };
};
