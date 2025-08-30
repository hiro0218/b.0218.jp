import { useCallback, useRef, useState } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';

export const useDropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /**
   * メニューの開閉を切り替える
   */
  const toggleDropdownMenuContent = () => {
    setIsOpen((prev) => !prev);
  };

  /**
   * 外部クリックでメニューを閉じる
   */
  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
  }, []);

  useClickOutside(ref, handleClickOutside);

  return {
    isOpen,
    ref,
    toggleDropdownMenuContent,
  };
};
