'use client';
'use no memo';

import { CheckIcon, LinkIcon, NoSymbolIcon, ShareIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useId, useRef, useState, useSyncExternalStore } from 'react';

import { IconSwap, type IconSwapActiveIcon } from '@/components/UI/IconSwap';
import { Stack } from '@/components/UI/Layout/Stack';
import { Toast, useToast } from '@/components/UI/Toast';
import { Tooltip } from '@/components/UI/Tooltip';
import { X_ACCOUNT } from '@/constants';
import { useClipboardCopy } from '@/hooks/useClipboardCopy';
import { useTimeout } from '@/hooks/useTimeout';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { Hatenabookmark } from '@/ui/icons/Hatenabookmark';
import { X } from '@/ui/icons/X';
import { css, cx } from '@/ui/styled';

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

export function PostShare({ title, url }: Props) {
  const labelledbyId = useId();
  const isShareSupported = useSyncExternalStore(emptySubscribe, getNavigatorShareSnapshot, getServerSnapshot);
  const isClipboardWriteSupported = useSyncExternalStore(
    emptySubscribe,
    getNavigatorClipboardSnapshot,
    getServerSnapshot,
  );
  const { ref, showToast, hideToast, message, isVisible } = useToast('記事のURLをコピーしました');
  const { copyText } = useClipboardCopy();
  const { schedule: scheduleCopyStateReset, cancel: cancelCopyStateReset } = useTimeout();
  const [copyState, setCopyState] = useState<CopyPermalinkState>('idle');
  const displayCopyState: CopyPermalinkState = isClipboardWriteSupported ? copyState : 'unsupported';
  const isCopyingRef = useRef(false);
  const classNames = cx('link-style--hover-effect', ShareButtonStyle);

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
      <Stack direction="horizontal" gap={1}>
        <Tooltip text="Xでポスト">
          <a
            aria-label="Xでポスト"
            className={classNames}
            href={`https://x.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}&via=${X_ACCOUNT}`}
            rel="noreferrer"
            target="_blank"
          >
            <X height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </a>
        </Tooltip>
        <Tooltip text="はてなブックマークでブックマーク">
          <a
            aria-label="はてなブックマークでブックマーク"
            className={classNames}
            href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`}
            rel="noreferrer"
            target="_blank"
          >
            <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </a>
        </Tooltip>
        <Tooltip text={COPY_PERMALINK_LABELS[displayCopyState]}>
          <button
            aria-label={COPY_PERMALINK_LABELS[displayCopyState]}
            className={classNames}
            data-state={displayCopyState}
            disabled={displayCopyState === 'unsupported'}
            onClick={onClickCopyPermalink}
            type="button"
          >
            <IconSwap
              activeIcon={activeCopyIcon}
              primaryIcon={<LinkIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
              secondaryIcon={<CopyFeedbackIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
            />
          </button>
        </Tooltip>
        {isShareSupported ? (
          <Tooltip text="その他：共有">
            <button aria-label="その他：共有" className={classNames} onClick={onClickShare} type="button">
              <ShareIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
            </button>
          </Tooltip>
        ) : (
          <button aria-label="共有に未対応" className={classNames} disabled type="button">
            <ShareIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </button>
        )}
      </Stack>
      <Toast isVisible={isVisible} message={message} onHideToast={hideToast} ref={ref} />
    </aside>
  );
}

const ShareButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--sizes-icon-sm) * 2);
  height: calc(var(--sizes-icon-sm) * 2);
  transition: transform var(--transition-fast);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &::after {
    border-radius: var(--radii-full);
  }

  &:active {
    transform: scale(0.96);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &[data-state='copied'] {
    color: var(--colors-grass-1200);
  }

  &[data-state='failed'] {
    color: var(--colors-red-1200);
  }

  &[data-state='unsupported'] {
    color: var(--colors-gray-500);
  }
`;
