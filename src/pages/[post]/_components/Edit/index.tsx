import { GitHubLogoIcon, ICON_SIZE_SM } from '@/ui/icons';
import { styled } from '@/ui/styled';

type Props = {
  slug: string;
};

function PostEdit({ slug }: Props) {
  return (
    <Container>
      <Anchor
        href={`https://github.com/hiro0218/article/edit/master/_posts/${slug}.md`}
        rel="noreferrer"
        target="_blank"
      >
        <GitHubLogoIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
        Edit on GitHub
      </Anchor>
    </Container>
  );
}

export default PostEdit;

const Container = styled.div`
  margin-top: var(--space-6);
  text-align: right;
`;

const Anchor = styled.a`
  display: inline-flex;
  align-items: center;
  line-height: var(--line-height-sm);
  color: var(--text-12);

  &:hover {
    text-decoration: underline;
  }

  svg {
    margin-right: var(--space-½);
  }
`;
