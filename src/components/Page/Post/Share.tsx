'use client';
'use no memo';

import { CheckIcon, LinkIcon, NoSymbolIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useId, useRef, useState, useSyncExternalStore } from 'react';

import { IconButton } from '@/components/UI/IconButton';
import { IconSwap, type IconSwapActiveIcon } from '@/components/UI/IconSwap';
import { Stack } from '@/components/UI/Layout/Stack';
import { Toast, useToast } from '@/components/UI/Toast';
import { X_ACCOUNT } from '@/constants';
import { useClipboardCopy } from '@/hooks/useClipboardCopy';
import { useTimeout } from '@/hooks/useTimeout';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { Hatenabookmark } from '@/ui/icons/Hatenabookmark';
import { X } from '@/ui/icons/X';
import { css } from '@/ui/styled';

interface Props {
  title: string;
  url: string;
}

type CopyPermalinkState = 'idle' | 'copying' | 'copied' | 'failed' | 'unsupported';
type CopyPermalinkFeedbackState = Extract<CopyPermalinkState, 'copied' | 'failed' | 'unsupported'>;

const FEEDBACK_TIMEOUT_MS = 2000;

const COPY_PERMALINK_LABELS: Record<CopyPermalinkState, string> = {
  idle: 'ページのURLをコピー',
  copying: 'コピー中',
  copied: 'コピーしました',
  failed: 'コピーに失敗しました',
  unsupported: 'このブラウザはコピーに未対応',
};

const COPY_PERMALINK_FEEDBACK_ICONS = {
  copied: CheckIcon,
  failed: XMarkIcon,
  unsupported: NoSymbolIcon,
} satisfies Record<CopyPermalinkFeedbackState, typeof CheckIcon>;

function isCopyPermalinkFeedbackState(state: CopyPermalinkState): state is CopyPermalinkFeedbackState {
  return state === 'copied' || state === 'failed' || state === 'unsupported';
}

function getCopyPermalinkFeedbackIcon(state: CopyPermalinkState) {
  return isCopyPermalinkFeedbackState(state) ? COPY_PERMALINK_FEEDBACK_ICONS[state] : CheckIcon;
}

// React Compiler との互換性のため、subscribe 関数を外部で定義
const emptySubscribe = () => () => {};
const getNavigatorShareSnapshot = () => typeof navigator !== 'undefined' && !!navigator.share;
const getNavigatorClipboardSnapshot = () =>
  typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function';
const getServerSnapshot = () => false;
// クリップボード API はサーバー / 判定確定前では楽観的に「対応」とみなす。
// 初回レンダーで未対応 (secondary アイコン) を出すと、クライアントでの判定確定時に
// IconSwap が secondary -> primary へ不要にアニメートしてしまうため。
const getClipboardServerSnapshot = () => true;

export function PostShare({ title, url }: Props) {
  const labelledbyId = useId();
  const isShareSupported = useSyncExternalStore(emptySubscribe, getNavigatorShareSnapshot, getServerSnapshot);
  const isClipboardWriteSupported = useSyncExternalStore(
    emptySubscribe,
    getNavigatorClipboardSnapshot,
    getClipboardServerSnapshot,
  );
  const { ref, showToast, hideToast, message, isVisible } = useToast(
    '記事のURLをコピーしました！🎉シェアをお願いします！🙏',
  );
  const { copyText } = useClipboardCopy();
  const { schedule: scheduleCopyStateReset, cancel: cancelCopyStateReset } = useTimeout();
  const [copyState, setCopyState] = useState<CopyPermalinkState>('idle');
  const displayCopyState: CopyPermalinkState = isClipboardWriteSupported ? copyState : 'unsupported';
  const isCopyingRef = useRef(false);

  const onClickCopyPermalink = useCallback(async () => {
    if (isCopyingRef.current || displayCopyState === 'unsupported') return;
    isCopyingRef.current = true;
    cancelCopyStateReset();
    setCopyState('copying');

    try {
      const result = await copyText(url);

      if (result.status === 'copied') {
        setCopyState('copied');
        showToast();
        scheduleCopyStateReset(() => setCopyState('idle'), FEEDBACK_TIMEOUT_MS);
        return;
      }

      if (result.status === 'unsupported') {
        setCopyState('unsupported');
        console.error('[PostShare] Clipboard API not supported');
        return;
      }

      setCopyState('failed');
      console.error('[PostShare] Failed to copy text:', result.error);
      showToast('コピーに失敗しました');
      scheduleCopyStateReset(() => setCopyState('idle'), FEEDBACK_TIMEOUT_MS);
    } finally {
      isCopyingRef.current = false;
    }
  }, [cancelCopyStateReset, copyText, displayCopyState, scheduleCopyStateReset, showToast, url]);

  const onClickShare = useCallback(() => {
    if (!isShareSupported) return;

    navigator
      .share({
        title,
        url,
        text: title,
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      });
  }, [isShareSupported, title, url]);

  const CopyFeedbackIcon = getCopyPermalinkFeedbackIcon(displayCopyState);
  const showCopyFeedbackIcon = isCopyPermalinkFeedbackState(displayCopyState);
  const activeCopyIcon: IconSwapActiveIcon = showCopyFeedbackIcon ? 'secondary' : 'primary';

  return (
    <aside aria-labelledby={labelledbyId}>
      <h2 className="sr-only" id={labelledbyId}>
        このページをシェアする
      </h2>
      <Stack direction="horizontal" gap={100}>
        <IconButton
          aria-label="Xでポスト"
          as="externalLink"
          href={`https://x.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}&via=${X_ACCOUNT}`}
          tooltip="Xでポスト"
        >
          <X height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </IconButton>
        <IconButton
          aria-label="はてなブックマークでブックマーク"
          as="externalLink"
          href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`}
          tooltip="はてなブックマークでブックマーク"
        >
          <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </IconButton>
        <IconButton
          aria-label={COPY_PERMALINK_LABELS[displayCopyState]}
          className={copyStateColorStyle}
          data-state={displayCopyState}
          disabled={displayCopyState === 'unsupported'}
          onClick={onClickCopyPermalink}
          tooltip={COPY_PERMALINK_LABELS[displayCopyState]}
        >
          <IconSwap
            activeIcon={activeCopyIcon}
            primaryIcon={<LinkIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
            secondaryIcon={<CopyFeedbackIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
          />
        </IconButton>
        {isShareSupported ? (
          <IconButton aria-label="その他：共有" onClick={onClickShare} tooltip="その他：共有">
            <ShareIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </IconButton>
        ) : (
          <IconButton aria-label="共有に未対応" disabled>
            <ShareIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </IconButton>
        )}
      </Stack>
      <Toast isVisible={isVisible} message={message} onHideToast={hideToast} ref={ref} />
    </aside>
  );
}

const copyStateColorStyle = css`
  &[data-state='copied'] {
    color: var(--colors-copy-success-icon);
  }

  &[data-state='failed'] {
    color: var(--colors-red-1200);
  }

  &[data-state='unsupported'] {
    color: var(--colors-gray-500);
  }
`;
