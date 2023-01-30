import { FaTwitter } from 'react-icons/fa';

import { ScreenReaderOnlyText } from '@/components/UI/ScreenReaderOnlyText';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

interface Props {
  title: string;
  url: string;
}

const PostShare = ({ title, url }: Props) => {
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
            <FaTwitter size={32} />
            <Label>Tweet</Label>
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
`;

const Anchor = styled.a`
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
`;

const Label = styled.span`
  position: absolute;
  top: 100%;
  color: var(--text-11);
  font-size: var(--font-size-sm);
`;

const IconContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
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
