import { useRouter } from 'next/router';
import { type RefObject, useEffect } from 'react';

type Props = {
  ref: RefObject<HTMLDivElement>;
};

function useTwitterWidgetsLoad({ ref }: Props) {
  const { asPath } = useRouter();

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    window?.twttr?.widgets.load(ref.current);
  }, [asPath, ref]);
}

export default useTwitterWidgetsLoad;
