'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { useTimeout } from '@/hooks/useTimeout';

type ClipboardCopiedResult = { status: 'copied' };
type ClipboardCopyFailedResult = { status: 'failed'; error: Error };
type ClipboardCopyUnsupportedResult = { status: 'unsupported' };

export type ClipboardCopyResult = ClipboardCopiedResult | ClipboardCopyFailedResult | ClipboardCopyUnsupportedResult;

export type ClipboardCopyState = 'idle' | 'copying' | ClipboardCopyResult['status'];

export function isCopyResultState(state: ClipboardCopyState): state is ClipboardCopyResult['status'] {
  return state !== 'idle' && state !== 'copying';
}

const FEEDBACK_DURATION_MS = 2000;

const FEEDBACK_LABELS = {
  copying: 'コピー中',
  copied: 'コピーしました',
  failed: 'コピーに失敗しました',
  unsupported: 'このブラウザはコピーに未対応',
} satisfies Record<Exclude<ClipboardCopyState, 'idle'>, string>;

// subscribe 関数を hook の中で定義しない。React Compiler との互換性のため、外部で定義する
const emptySubscribe = () => () => {};
const isClipboardSupported = () =>
  typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function';
// サーバー / 判定確定前を「未対応」とみなさず、楽観的に「対応」とみなす。
// 初回レンダーで未対応 (secondary アイコン) を出すと、クライアントでの判定確定時に
// IconSwap が secondary -> primary へ不要にアニメートしてしまう。
const getServerSnapshot = () => true;

export function useClipboardCopy(idleLabel: string) {
  const isSupported = useSyncExternalStore(emptySubscribe, isClipboardSupported, getServerSnapshot);
  const [copyState, setCopyState] = useState<ClipboardCopyState>('idle');
  const isCopyingRef = useRef(false);
  const { schedule, cancel } = useTimeout();

  const state = isSupported ? copyState : 'unsupported';
  const label = state === 'idle' ? idleLabel : FEEDBACK_LABELS[state];

  /** コピー中・未対応のときは何もせず null を返す */
  const copy = async (text: string): Promise<(ClipboardCopyResult & { label: string }) | null> => {
    if (isCopyingRef.current || state === 'unsupported') return null;

    isCopyingRef.current = true;
    cancel();
    setCopyState('copying');

    let result: ClipboardCopyResult = { status: 'unsupported' };
    if (isClipboardSupported()) {
      try {
        await navigator.clipboard.writeText(text);
        result = { status: 'copied' };
      } catch (error) {
        result = { status: 'failed', error: error instanceof Error ? error : new Error(String(error)) };
      }
    }

    isCopyingRef.current = false;
    setCopyState(result.status);
    if (result.status !== 'unsupported') schedule(() => setCopyState('idle'), FEEDBACK_DURATION_MS);

    return { ...result, label: FEEDBACK_LABELS[result.status] };
  };

  return { state, label, copy };
}
