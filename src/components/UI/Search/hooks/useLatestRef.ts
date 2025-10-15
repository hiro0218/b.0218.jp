import { useLayoutEffect, useRef } from 'react';

/**
 * 常に最新の値を参照できるrefを提供するカスタムフック
 * useLayoutEffectを使用してDOM更新前に同期的にrefを更新し、古い値の参照を防ぐ
 *
 * @param value 最新の状態を保持したい値
 * @returns 常に最新の値を参照できるref
 */
export const useLatestRef = <T>(value: T) => {
  const ref = useRef(value);

  useLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};
