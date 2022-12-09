import { useEffect } from 'react';

export default function useRouterScrollTop() {
  useEffect(() => {
    const handlePageShow = () => {
      window.setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    };

    window.addEventListener('pageshow', handlePageShow);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
}
