import { FaGithub } from 'react-icons/fa';

import { styled } from '@/ui/styled';

type Props = {
  slug: string;
};

const PostEdit = ({ slug }: Props) => {
  return (
    <Container>
      <Anchor
        href={`https://github.com/hiro0218/article/edit/master/_posts/${slug}.md`}
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub size={18} />
        Edit on GitHub
      </Anchor>
    </Container>
  );
};

export default PostEdit;

const Container = styled.div`
  margin-top: var(--space-x-xl);
  text-align: right;
`;

const Anchor = styled.a`
  display: inline-flex;
  align-items: center;
  color: var(--text-11);
  font-size: var(--font-size-sm);

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: 0.25em;
    fill: var(--text-12);
  }
`;
