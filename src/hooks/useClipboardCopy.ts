'use client';

import { useCallback, useMemo } from 'react';

type ClipboardCopiedResult = { status: 'copied' };
type ClipboardCopyFailedResult = { status: 'failed'; error: Error };
type ClipboardCopyUnsupportedResult = { status: 'unsupported' };

export type ClipboardCopyResult = ClipboardCopiedResult | ClipboardCopyFailedResult | ClipboardCopyUnsupportedResult;

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
