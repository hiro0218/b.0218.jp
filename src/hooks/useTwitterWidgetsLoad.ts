import { usePathname } from 'next/navigation';
import { type RefObject, useEffect } from 'react';

type Props = {
  ref: RefObject<HTMLDivElement>;
};

function useTwitterWidgetsLoad({ ref }: Props) {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    window?.twttr?.widgets.load(ref.current);
  }, [pathname, ref]);
}

export default useTwitterWidgetsLoad;
