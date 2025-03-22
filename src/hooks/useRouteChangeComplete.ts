'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

type RouteChangeCallback = () => void;

export const useRouteChangeComplete = (callback: RouteChangeCallback): void => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 前回のパスとクエリパラメータを保存するためのref
  const previousPathnameRef = useRef(pathname);
  const previousSearchParamsRef = useRef(searchParams);

  useEffect(() => {
    // パスかクエリパラメータが変更された場合にコールバックを実行
    if (pathname !== previousPathnameRef.current || searchParams !== previousSearchParamsRef.current) {
      callback();
    }

    // 現在の値を保存
    previousPathnameRef.current = pathname;
    previousSearchParamsRef.current = searchParams;
  }, [pathname, searchParams, callback]);
};
