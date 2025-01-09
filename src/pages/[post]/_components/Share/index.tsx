import { useCallback, useId } from 'react';

import { Stack } from '@/components/UI/Layout';
import { Toast } from '@/components/UI/Toast';
import { Tooltip } from '@/components/UI/Tooltip';
import { X_ACCOUNT } from '@/constant';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Hatenabookmark, ICON_SIZE_SM, Link2Icon, X } from '@/ui/icons';
import { css, styled } from '@/ui/styled/dynamic';

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
        <Anchor
          className="link-style--hover-effect"
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}&via=${X_ACCOUNT}`}
          rel="noreferrer"
          target="_blank"
        >
          <Tooltip text="Xでポストする" />
          <X height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Anchor>
        <Anchor
          className="link-style--hover-effect"
          href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`}
          rel="noreferrer"
          target="_blank"
        >
          <Tooltip text="はてなブックマークでブックマークする" />
          <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Anchor>
        <Button className="link-style--hover-effect" onClick={onClickCopyPermalink} type="button">
          <Tooltip text="このページのURLをコピーする" />
          <Link2Icon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Button>
      </Stack>
      {ToastComponent}
    </aside>
  );
}

const ShareButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${ICON_SIZE_SM * 2}px;
  height: ${ICON_SIZE_SM * 2}px;

  &::after {
    border-radius: var(--border-radius-full);
  }
`;

const Anchor = styled.a`
  ${ShareButtonStyle}
`;

const Button = styled.button`
  ${ShareButtonStyle}
`;

export default PostShare;
