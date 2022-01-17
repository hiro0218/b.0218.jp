import styled from '@emotion/styled';
import { FC } from 'react';
import { FaTwitter } from 'react-icons/fa';

import { Stack } from '@/components/Layout';

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

  &:focus,
  &:hover {
    background-color: var(--bg-color--lighter);
  }

  svg {
    color: var(--color-text--light);
  }
`;

const PostShare: FC<Props> = ({ title, url }) => {
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
