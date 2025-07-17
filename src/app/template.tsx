'use client';

import { type ReactNode, useLayoutEffect } from 'react';
import debounce from '@/lib/debounce';
import observeScrollbarWidth from '@/lib/observeScrollbarWidth';
import smoothScroll from '@/lib/smoothScroll';

type Props = {
  children: ReactNode;
};

export default function Template({ children }: Props) {
  const onLoad = () => {
    smoothScroll();
    observeScrollbarWidth();
  };
  const handleObserveScrollbarWidth = () => debounce(observeScrollbarWidth);

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run once on mount and unmount, and onResize. Adding `onLoad` or `handleObserveScrollbarWidth` to the dependency array would cause infinite loops or unnecessary re-runs.
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
