import { GitHubLogoIcon, ICON_SIZE_XS } from '@/ui/icons';
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
        <GitHubLogoIcon height={ICON_SIZE_XS} width={ICON_SIZE_XS} />
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
