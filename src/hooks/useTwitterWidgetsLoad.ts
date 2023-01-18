import { useRouter } from 'next/router';
import { MutableRefObject, useEffect } from 'react';

type Props = {
  ref: MutableRefObject<HTMLDivElement>;
};

function useTwitterWidgetsLoad({ ref }: Props) {
  const { asPath } = useRouter();

  useEffect(() => {
    window?.twttr?.widgets.load(ref.current);
  }, [asPath, ref]);
}

export default useTwitterWidgetsLoad;
