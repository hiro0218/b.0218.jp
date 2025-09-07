import { useEffect, useRef } from 'react';

/**
 * 常に最新の値を参照できるrefを提供するカスタムフック
 * useEffectのクロージャー問題を回避し、古い値の参照を防ぐ
 *
 * @param value 最新の状態を保持したい値
 * @returns 常に最新の値を参照できるref
 */
export const useLatestRef = <T>(value: T) => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};
