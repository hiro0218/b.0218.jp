import { useCallback } from 'react';

import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
import { SiHatenabookmark, SiTwitter } from '@/ui/icons';
import { HiLink } from '@/ui/icons';
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
        >
          <IconContainer>
            <SiTwitter size={ICON_SIZE / 2} />
            <Label>Tweet</Label>
          </IconContainer>
        </Anchor>
        <Anchor href={`https://b.hatena.ne.jp/entry/panel/?url=${url}`} target="_blank" rel="noopener noreferrer">
          <IconContainer>
            <SiHatenabookmark size={ICON_SIZE / 2} />
            <Label>Bookmark</Label>
          </IconContainer>
        </Anchor>
        <Anchor as="button" type="button" title="記事のURLをコピーする" onClick={onClickCopyPermalink}>
          <IconContainer>
            <HiLink size={ICON_SIZE / 2} />
            <Label>Copy</Label>
          </IconContainer>
        </Anchor>
      </Container>
    </section>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--space-6);
  gap: var(--space-3);
`;

const Anchor = styled.a`
  display: flex;
  text-align: center;
  justify-content: center;
  line-height: 1;
  cursor: pointer;
`;

const Label = styled.span`
  position: absolute;
  top: 100%;
  display: block;
  color: var(--text-11);
  font-size: var(--font-size-sm);
  line-height: 1.5;
  white-space: nowrap;
`;

const IconContainer = styled.div`
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
