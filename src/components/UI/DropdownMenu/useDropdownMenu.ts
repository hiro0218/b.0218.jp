import { useEffect, useRef, useState } from 'react';

/**
 * ドロップダウンメニューの状態管理とイベントハンドリングを行うカスタムフック
 * メニューの開閉状態、外部クリックイベントの処理を担当する
 *
 * @returns ドロップダウンメニューの状態とハンドラー
 */
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
   * 外部クリックイベントのセットアップ
   * メニュー外がクリックされた場合にメニューを閉じる
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return {
    isOpen,
    ref,
    toggleDropdownMenuContent,
  };
};
