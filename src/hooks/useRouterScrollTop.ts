import { useRouter } from 'next/router';
import { useEffect } from 'react';

function extractHash(url: string) {
  return url.split('#')[1] ?? '';
}

export default function useRouterScrollTop() {
  const router = useRouter();
  const hasHash = extractHash(router.asPath);

  useEffect(() => {
    const handlePageShow = () => {
      if (hasHash) {
        return;
      }

      window.setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [hasHash]);
}
