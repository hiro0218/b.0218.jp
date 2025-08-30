import { type RefObject, useEffect } from 'react';

/**
 * 要素の外部がクリックされた際にコールバック関数を実行するカスタムフック
 * @param ref - 外部クリックを検知する対象要素のref
 * @param callback - 外部クリックされた際に実行するコールバック関数
 */
export const useClickOutside = (ref: RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [ref, callback]);
};
