import dynamic from 'next/dynamic';
import { useCallback, useId } from 'react';

import { Stack } from '@/components/UI/Layout';
import { Toast } from '@/components/UI/Toast';
import { Tooltip } from '@/components/UI/Tooltip';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { Hatenabookmark, ICON_SIZE_SM, Link2Icon, X } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
import { css, styled } from '@/ui/styled';

const SrOnly = dynamic(() =>
  import('@/components/UI/ScreenReaderOnlyText').then((module) => module.ScreenReaderOnlyText),
);

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
      <SrOnly as="h2" id={labelledbyId} text="このページをシェアする" />
      <Stack direction="horizontal" space="1">
        <Anchor
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Tooltip text="Xでポストする" />
          <X height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Anchor>
        <Anchor href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`} rel="noopener noreferrer" target="_blank">
          <Tooltip text="はてなブックマークでブックマークする" />
          <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Anchor>
        <Button onClick={onClickCopyPermalink} type="button">
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

  ${showHoverBackground}

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
