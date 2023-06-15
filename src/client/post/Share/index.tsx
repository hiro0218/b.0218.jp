import { useCallback } from 'react';

import { ScreenReaderOnlyText as SrOnly } from '@/components/UI/ScreenReaderOnlyText';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import useToast from '@/hooks/useToast';
import { ICON_SIZE_SM, RxLink2, SiHatenabookmark, SiTwitter } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
import { css, styled } from '@/ui/styled';

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
    <section>
      <SrOnly as="h2" text="このページをシェアする" />
      <Container>
        <Anchor
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <SrOnly text="Twitterでツイートする" />
          <IconContainer>
            <SiTwitter size={ICON_SIZE_SM} />
          </IconContainer>
        </Anchor>
        <Anchor href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`} rel="noopener noreferrer" target="_blank">
          <SrOnly text="はてなブックマークでブックマークする" />
          <IconContainer>
            <SiHatenabookmark size={ICON_SIZE_SM} />
          </IconContainer>
        </Anchor>
        <Button onClick={onClickCopyPermalink} type="button">
          <SrOnly text="このページのURLをコピーする" />
          <IconContainer>
            <RxLink2 size={ICON_SIZE_SM} />
          </IconContainer>
        </Button>
      </Container>
    </section>
  );
}

const Container = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-6);
`;

const ShareButtonStyle = css`
  display: flex;
  justify-content: center;
  line-height: 1;
  text-align: center;

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

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${ICON_SIZE_SM * 2}px;
  height: ${ICON_SIZE_SM * 2}px;
`;

export default PostShare;
