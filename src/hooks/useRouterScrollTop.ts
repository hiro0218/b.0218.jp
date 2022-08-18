import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export default function useRouterScrollTop() {
  const router = useRouter();
  const handleRouteChange = useCallback(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [handleRouteChange, router.events]);
}
