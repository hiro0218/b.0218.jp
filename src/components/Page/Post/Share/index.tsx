import { FaTwitter } from 'react-icons/fa';

import { Stack } from '@/components/UI/Layout';
import { showHoverBackground } from '@/ui/mixin';
import { styled } from '@/ui/styled';

interface Props {
  title: string;
  url: string;
}

const Root = styled.a`
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

  &:focus {
    background-color: var(--component-backgrounds-5);
  }

  svg {
    color: var(--text-12);
  }
`;

const PostShare = ({ title, url }: Props) => {
  return (
    <Stack justify="center">
      <Stack.Item align="center" justify="center">
        <Root
          href={'https://twitter.com/intent/tweet?url=' + url + '&text=' + encodeURIComponent(title)}
          title="Share Twitter"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FaTwitter />
        </Root>
      </Stack.Item>
    </Stack>
  );
};

export default PostShare;
