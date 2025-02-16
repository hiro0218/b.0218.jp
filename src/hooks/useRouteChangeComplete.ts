import { useRouter } from 'next/router';
import { useEffect } from 'react';

type Props = () => void;

export const useRouteChangeComplete = (callback: Props): void => {
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeComplete', callback);

    return () => {
      router.events.off('routeChangeComplete', callback);
    };
  }, [router.events, callback]);
};
