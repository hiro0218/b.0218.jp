'use client';

import { useCallback, useEffect, useId } from 'react';

import { Stack } from '@/components/UI/Layout';
import { Toast } from '@/components/UI/Toast';
import { Tooltip } from '@/components/UI/Tooltip';
import { X_ACCOUNT } from '@/constant';
import { useBoolean } from '@/hooks/useBoolean';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Hatenabookmark, ICON_SIZE_SM, Link2Icon, Share1Icon, X } from '@/ui/icons';
import { css, cx } from '@/ui/styled';

interface Props {
  title: string;
  url: string;
}

function PostShare({ title, url }: Props) {
  const labelledbyId = useId();
  const { value: isShareSupported, setTrue: setShareSupported } = useBoolean(false);
  const [, copy] = useCopyToClipboard();
  const { Component: ToastComponent, showToast } = Toast('記事のURLをコピーしました');
  const classNames = cx('link-style--hover-effect', ShareButtonStyle);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setShareSupported();
    }
  }, [setShareSupported]);

  const onClickCopyPermalink = useCallback(() => {
    copy(url).then(() => {
      showToast();
    });
  }, [copy, showToast, url]);

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
      <Stack direction="horizontal" space={1}>
        <a
          className={classNames}
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}&via=${X_ACCOUNT}`}
          rel="noreferrer"
          target="_blank"
        >
          <Tooltip text="Xでポスト" />
          <X height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </a>
        <a
          className={classNames}
          href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`}
          rel="noreferrer"
          target="_blank"
        >
          <Tooltip text="はてなブックマークでブックマーク" />
          <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </a>
        <button className={classNames} onClick={onClickCopyPermalink} type="button">
          <Tooltip text="ページのURLをコピー" />
          <Link2Icon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </button>
        {isShareSupported && (
          <button className={classNames} onClick={onClickShare} type="button">
            <Tooltip text="その他：共有" />
            <Share1Icon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </button>
        )}
      </Stack>
      {ToastComponent}
    </aside>
  );
}

const ShareButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--sizes-icon-sm) * 2);
  height: calc(var(--sizes-icon-sm) * 2);

  &::after {
    border-radius: var(--radii-full);
  }
`;

export default PostShare;
