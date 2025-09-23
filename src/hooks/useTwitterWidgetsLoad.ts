import { usePathname } from 'next/navigation';
import { type RefObject, useEffect } from 'react';

type Props = {
  ref: RefObject<HTMLDivElement>;
  enabled?: boolean;
};

function useTwitterWidgetsLoad({ ref, enabled = true }: Props): void {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This effect should re-run when the pathname changes to load Twitter widgets for the new page.
  useEffect(() => {
    if (!enabled || !ref.current) {
      return;
    }
    window?.twttr?.widgets.load(ref.current);
  }, [pathname, ref, enabled]);
}

export default useTwitterWidgetsLoad;
