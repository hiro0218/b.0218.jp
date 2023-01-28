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
            <FaTwitter />
            <span>Tweet</span>
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

  svg {
    color: var(--text-12);
  }
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  font-size: 1.8rem;

  ${showHoverBackground}

  &::after {
    border-radius: 100%;
  }

  > span {
    position: absolute;
    top: 3.5rem;
    color: var(--text-11);
    font-size: var(--font-size-sm);
  }
`;

export default PostShare;
