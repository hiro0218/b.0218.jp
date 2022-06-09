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
        href={'https://twitter.com/intent/tweet?url=' + url + '&text=' + encodeURIComponent(title)}
        title="Share Twitter"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
      >
        <FaTwitter />
      </Anchor>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
`

const Anchor = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.25em;
  transition: background-color 0.4s;
  border-radius: 100%;
  font-size: 1.75rem;
  text-align: center;

  ${showHoverBackground}

  &::after {
    border-radius: 100%;
  }

  svg {
    color: var(--text-12);
  }
`;

export default PostShare;
