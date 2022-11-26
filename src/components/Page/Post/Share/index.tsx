import { FaTwitter } from 'react-icons/fa';

import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

interface Props {
  title: string;
  url: string;
}

const PostShare = ({ title, url }: Props) => {
  return (
    <Container>
      <Anchor
        href={`https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <IconContainer data-label="Tweet">
          <FaTwitter />
        </IconContainer>
      </Anchor>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: var(--space-x-xl);
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

  &::before {
    content: attr(data-label);
    position: absolute;
    top: 3.5rem;
    color: var(--text-11);
    font-size: var(--font-size-sm);
  }
`;

export default PostShare;
