'use client';

import { useCallback, useId } from 'react';

import { Stack } from '@/components/UI/Layout';
import { Toast } from '@/components/UI/Toast';
import { Tooltip } from '@/components/UI/Tooltip';
import { X_ACCOUNT } from '@/constant';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Hatenabookmark, ICON_SIZE_SM, Link2Icon, X } from '@/ui/icons';
import { css, cx } from '@/ui/styled/static';

interface Props {
  title: string;
  url: string;
}

function PostShare({ title, url }: Props) {
  const labelledbyId = useId();
  const [, copy] = useCopyToClipboard();
  const { Component: ToastComponent, showToast } = Toast('記事のURLをコピーしました');

  const onClickCopyPermalink = useCallback(() => {
    copy(url).then(() => {
      showToast();
    });
  }, [copy, showToast, url]);

  return (
    <aside aria-labelledby={labelledbyId}>
      <h2 className="sr-only" id={labelledbyId}>
        このページをシェアする
      </h2>
      <Stack direction="horizontal" space={1}>
        <a
          className={cx('link-style--hover-effect', ShareButtonStyle)}
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}&via=${X_ACCOUNT}`}
          rel="noreferrer"
          target="_blank"
        >
          <Tooltip text="Xでポスト" />
          <X height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </a>
        <a
          className={cx('link-style--hover-effect', ShareButtonStyle)}
          href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`}
          rel="noreferrer"
          target="_blank"
        >
          <Tooltip text="はてなブックマークでブックマーク" />
          <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </a>
        <button
          className={cx('link-style--hover-effect', ShareButtonStyle)}
          onClick={onClickCopyPermalink}
          type="button"
        >
          <Tooltip text="ページのURLをコピー" />
          <Link2Icon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </button>
      </Stack>
      {ToastComponent}
    </aside>
  );
}

const ShareButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(var(--icon-size-sm) * 2);
  height: calc(var(--icon-size-sm) * 2);

  &::after {
    border-radius: var(--border-radius-full);
  }
`;

export default PostShare;
