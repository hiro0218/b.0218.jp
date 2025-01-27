import { useRouter } from 'next/router';
import { useCallback } from 'react';

/**
 * @example
 * ```ts
 * const [hash, setHash] = useHash()
 * ```
 */
export function useHash(): [string, (newHash: string) => void] {
  const router = useRouter();
  const hash = extractHash(router.asPath);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const setHash = useCallback((newHash: string) => {
    router.push({ hash: newHash }, undefined, { shallow: true });
  }, []);
  return [hash, setHash];
}

function extractHash(url: string) {
  return url.split('#')[1] ?? '';
}
