'use client';
'use no memo';

import { LinkIcon, ShareNetworkIcon, XLogoIcon } from '@phosphor-icons/react';

import { useCallback, useId, useSyncExternalStore } from 'react';
import { CopyFeedbackIcon } from '@/components/UI/CopyFeedbackIcon';
import { IconButton } from '@/components/UI/IconButton';
import { IconLink } from '@/components/UI/IconLink';
import { Stack } from '@/components/UI/Layout/Stack';
import { Toast, useToast } from '@/components/UI/Toast';
import { X_ACCOUNT } from '@/constants';
import { useClipboardCopy } from '@/hooks/useClipboardCopy';
import { Hatenabookmark } from '@/ui/icons/Hatenabookmark';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { css, styled } from '@/ui/styled';

interface Props {
  title: string;
  url: string;
}

// React Compiler との互換性のため、subscribe 関数を外部で定義
const emptySubscribe = () => () => {};
const getNavigatorShareSnapshot = () => typeof navigator !== 'undefined' && !!navigator.share;
const getServerSnapshot = () => false;

export function PostShare({ title, url }: Props) {
  const labelledbyId = useId();
  const isShareSupported = useSyncExternalStore(emptySubscribe, getNavigatorShareSnapshot, getServerSnapshot);
  const { showToast, hideToast, message, isVisible } = useToast(
    '記事のURLをコピーしました！🎉シェアをお願いします！🙏',
  );
  const { state: copyState, label: copyLabel, copy } = useClipboardCopy('ページのURLをコピー');

  const onClickCopyPermalink = async () => {
    const result = await copy(url);
    if (!result) return;

    if (result.status === 'copied') {
      showToast();
      return;
    }

    if (result.status === 'unsupported') {
      console.error('[PostShare] Clipboard API not supported');
      return;
    }

    console.error('[PostShare] Failed to copy text:', result.error);
    showToast(result.label);
  };

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

  return (
    <aside aria-labelledby={labelledbyId}>
      <h2 className="sr-only" id={labelledbyId}>
        このページをシェアする
      </h2>
      <Controls>
        <Stack className={insetStyle} direction="horizontal" gap={100}>
          <IconLink
            aria-label="Xでポスト"
            as="externalLink"
            href={`https://x.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}&via=${X_ACCOUNT}`}
            tooltip="Xでポスト"
          >
            <XLogoIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </IconLink>
          <IconLink
            aria-label="はてなブックマークでブックマーク"
            as="externalLink"
            href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`}
            tooltip="はてなブックマークでブックマーク"
          >
            <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </IconLink>
          <IconButton
            aria-label={copyLabel}
            disabled={copyState === 'unsupported'}
            onClick={onClickCopyPermalink}
            tooltip={copyLabel}
          >
            <CopyFeedbackIcon idleIcon={<LinkIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />} state={copyState} />
          </IconButton>
          {isShareSupported ? (
            <IconButton aria-label="その他：共有" onClick={onClickShare} tooltip="その他：共有">
              <ShareNetworkIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
            </IconButton>
          ) : (
            <IconButton aria-label="共有に未対応" disabled>
              <ShareNetworkIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
            </IconButton>
          )}
        </Stack>
        {/* この空の要素を消さない。サイト全体で読み込む Google の publisher.js が、この要素をボタンに置き換えるため */}
        <div {...{ 'google-add-preferred-source-btn': '' }} className={googleButtonStyle} data-lang="ja"></div>
      </Controls>
      <Toast isVisible={isVisible} message={message} onHideToast={hideToast} />
    </aside>
  );
}

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: var(--spacing-100);
  column-gap: var(--spacing-300);
  align-items: center;
`;

// アイコンと文字の端をそろえるために、ボタンは縮めない。押せる範囲が 36px（タッチの画面で 44px）を下回るため。
// insetStyle を Controls に付けない。面のある Google のボタンまで文字の端より左（タッチの画面で 10px）へ出て、前後の間隔も食うため
const insetStyle = css`
  margin: calc((var(--control-min-size) - var(--sizes-icon-sm)) / -2);
`;

// ボタンが入るまで空のままにしない。publisher.js が後から幅 253.5px・高さ 40px のボタンを入れると、折り返しと行の高さが変わり、下の本文が押し下げられるため
const googleButtonStyle = css`
  min-width: 254px;
  min-height: 40px;
`;
