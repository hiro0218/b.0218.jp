import { useCallback } from 'react';

import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { fadeIn } from '@/ui/animation';
import { SiHatenabookmark, SiTwitter } from '@/ui/icons';
import { RxLink2 } from '@/ui/icons';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

interface Props {
  title: string;
  url: string;
}

const ICON_SIZE = 56;

const PostShare = ({ title, url }: Props) => {
  const [, copy] = useCopyToClipboard();
  const onClickCopyPermalink = useCallback(() => {
    copy(url);
  }, [copy, url]);

  return (
    <section>
      <ScreenReaderOnlyText as="h2" text={'このページをシェアする'} />
      <Container>
        <Anchor
          href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Twitterでツイートする"
        >
          <IconContainer>
            <SiTwitter size={ICON_SIZE / 2} />
          </IconContainer>
        </Anchor>
        <Anchor
          href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          title="はてなブックマークでブックマークする"
        >
          <IconContainer>
            <SiHatenabookmark size={ICON_SIZE / 2} />
          </IconContainer>
        </Anchor>
        <Anchor as="button" type="button" title="記事のURLをコピーする" onClick={onClickCopyPermalink}>
          <IconContainer>
            <RxLink2 size={ICON_SIZE / 2} />
          </IconContainer>
        </Anchor>
      </Container>
    </section>
  );
};

const Container = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-6);
`;

const Anchor = styled.a`
  position: relative;
  display: flex;
  justify-content: center;
  line-height: 1;
  text-align: center;
  cursor: pointer;

  &::after {
    position: absolute;
    bottom: calc(100% + var(--space-1));
    left: 50%;
    z-index: 1;
    display: none;
    padding: var(--space-1);
    font-size: var(--font-size-sm);
    color: var(--text-11);
    white-space: nowrap;
    content: attr(title);
    background-color: var(--component-backgrounds-4);
    border-radius: var(--border-radius-4);
    transform: translateX(-50%);
  }

  &:hover {
    &::after {
      display: block;
      animation: ${fadeIn} 0.2s linear both;
    }
  }
`;

const IconContainer = styled.span`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  margin: auto;

  ${showHoverBackground}

  &::after {
    border-radius: var(--border-radius-full);
  }

  svg {
    color: var(--text-12);
  }
`;

export default PostShare;
