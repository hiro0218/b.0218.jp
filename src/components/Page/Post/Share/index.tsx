import { useCallback } from 'react';
import { FaTwitter } from 'react-icons/fa';
import { HiLink } from 'react-icons/hi';

import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';
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
          aria-label="Tweetする"
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconContainer>
            <FaTwitter size={ICON_SIZE / 2} />
            <Label>Tweet</Label>
          </IconContainer>
        </Anchor>
        <Anchor as="button" type="button" onClick={onClickCopyPermalink}>
          <IconContainer>
            <HiLink size={ICON_SIZE / 2} />
            <Label>Copy URL</Label>
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
  gap: var(--space-2);
`;

const Anchor = styled.a`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  cursor: pointer;
`;

const Label = styled.span`
  position: absolute;
  top: 100%;
  display: block;
  color: var(--text-11);
  font-size: var(--font-size-sm);
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
