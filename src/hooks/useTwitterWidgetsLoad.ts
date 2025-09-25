import { usePathname } from 'next/navigation';
import { type RefObject, useEffect } from 'react';

type Props = {
  ref: RefObject<HTMLDivElement>;
};

/**
 * Twitter埋め込みウィジェットを動的に読み込むカスタムフック
 */
function useTwitterWidgetsLoad({ ref }: Props): void {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should re-run when the pathname changes to load Twitter widgets for the new page.
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if ('twttr' in window) {
      window.twttr?.widgets.load(ref.current);
    }
  }, [pathname, ref]);
}

export default useTwitterWidgetsLoad;
