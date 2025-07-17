import { usePathname } from 'next/navigation';
import { type RefObject, useEffect } from 'react';

type Props = {
  ref: RefObject<HTMLDivElement>;
};

function useTwitterWidgetsLoad({ ref }: Props): void {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should re-run when the pathname changes to load Twitter widgets for the new page.
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    window?.twttr?.widgets.load(ref.current);
  }, [pathname, ref]);
}

export default useTwitterWidgetsLoad;
