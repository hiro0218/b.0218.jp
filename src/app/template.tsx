'use client';

import debounce from '@/lib/debounce';
import observeScrollbarWidth from '@/lib/observeScrollbarWidth';
import smoothScroll from '@/lib/smoothScroll';
import { type ReactNode, useLayoutEffect } from 'react';

type Props = {
  children: ReactNode;
};

export default function Template({ children }: Props) {
  const onLoad = () => {
    smoothScroll();
    observeScrollbarWidth();
  };
  const handleObserveScrollbarWidth = () => debounce(observeScrollbarWidth);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useLayoutEffect(() => {
    window.addEventListener('load', onLoad);
    window.addEventListener('resize', handleObserveScrollbarWidth);

    return () => {
      window.removeEventListener('load', onLoad);
      window.removeEventListener('resize', handleObserveScrollbarWidth);
    };
  }, []);

  return <>{children}</>;
}
