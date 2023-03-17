import { RxGithubLogo } from '@/ui/icons';
import { styled } from '@/ui/styled';

type Props = {
  slug: string;
};

const PostEdit = ({ slug }: Props) => {
  return (
    <Container>
      <Anchor
        href={`https://github.com/hiro0218/article/edit/master/_posts/${slug}.md`}
        rel="noreferrer"
        target="_blank"
      >
        <RxGithubLogo size={18} />
        Edit on GitHub
      </Anchor>
    </Container>
  );
};

export default PostEdit;

const Container = styled.div`
  margin-top: var(--space-6);
  text-align: right;
`;

const Anchor = styled.a`
  display: inline-flex;
  align-items: center;
  padding: var(--space-1);
  font-size: var(--font-size-sm);
  line-height: 1;
  color: var(--text-12);
  border-radius: var(--border-radius-4);

  &:hover {
    background-color: var(--component-backgrounds-3A);
  }

  svg {
    margin-right: 0.25em;
    fill: currentColor;
  }
`;
