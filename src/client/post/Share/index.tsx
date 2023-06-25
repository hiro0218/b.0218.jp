import dynamic from 'next/dynamic';
import { useCallback } from 'react';

import { Stack } from '@/components/UI/Layout';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import useToast from '@/hooks/useToast';
import { Hatenabookmark, ICON_SIZE_SM, Link2Icon, TwitterLogoIcon } from '@/ui/icons';
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
  const [, copy] = useCopyToClipboard();
  const toast = useToast('記事のURLをコピーしました');

  const onClickCopyPermalink = useCallback(() => {
    copy(url).then(() => toast());
  }, [copy, toast, url]);

  return (
    <aside>
      <SrOnly as="h2" text="このページをシェアする" />
      <Stack direction="horizontal" space="1">
        <Anchor
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <SrOnly text="Twitterでツイートする" />
          <TwitterLogoIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Anchor>
        <Anchor href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`} rel="noopener noreferrer" target="_blank">
          <SrOnly text="はてなブックマークでブックマークする" />
          <Hatenabookmark height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Anchor>
        <Button onClick={onClickCopyPermalink} type="button">
          <SrOnly text="このページのURLをコピーする" />
          <Link2Icon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        </Button>
      </Stack>
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
