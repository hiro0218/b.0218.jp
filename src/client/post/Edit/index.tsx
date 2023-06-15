import { ICON_SIZE_XS, RxGithubLogo } from '@/ui/icons';
import { hoverLinkStyle } from '@/ui/mixin';
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
        <RxGithubLogo size={ICON_SIZE_XS} />
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
  padding: var(--space-1);
  font-size: var(--font-size-xs);
  line-height: 1;
  color: var(--text-12);
  border-radius: var(--border-radius-4);

  ${hoverLinkStyle}

  svg {
    margin-right: var(--space-½);
  }
`;
