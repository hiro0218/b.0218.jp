'use client';

import { useCallback, useMemo } from 'react';

export type ClipboardCopyResult = { status: 'copied' } | { status: 'failed'; error: Error } | { status: 'unsupported' };

export function useClipboardCopy() {
  const copyText = useCallback(async (text: string): Promise<ClipboardCopyResult> => {
    if (typeof navigator === 'undefined' || typeof navigator.clipboard?.writeText !== 'function') {
      return { status: 'unsupported' };
    }

    try {
      await navigator.clipboard.writeText(text);
      return { status: 'copied' };
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      return { status: 'failed', error: normalized };
    }
  }, []);

  return useMemo(() => ({ copyText }), [copyText]);
}
