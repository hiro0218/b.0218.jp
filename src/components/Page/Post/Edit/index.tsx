import { DropdownMenu } from '@/components/UI/DropdownMenu/index';
import { GitHubLogoIcon, ICON_SIZE_SM } from '@/ui/icons';
import { styled } from '@/ui/styled/static';

type Props = {
  slug: string;
};

function PostEdit({ slug }: Props) {
  return (
    <aside>
      <DropdownMenu
        menuHorizontalPosition="right"
        title={
          <>
            <span className="sr-only">Feedback</span>
            <GitHubLogoIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </>
        }
      >
        <>
          <Anchor
            href={`https://github.com/hiro0218/article/edit/master/_posts/${slug}.md`}
            rel="noreferrer"
            target="_blank"
          >
            Edit on GitHub
          </Anchor>
          <Anchor
            href={`https://github.com/hiro0218/article/blob/master/_posts/${slug}.md`}
            rel="noreferrer"
            target="_blank"
          >
            View raw file on GitHub
          </Anchor>
        </>
      </DropdownMenu>
    </aside>
  );
}

export default PostEdit;

const Anchor = styled.a`
  display: flex;
  align-items: center;
  padding: var(--space-½) var(--space-1);
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-12);
  border-radius: var(--radii-2);

  &:hover {
    background-color: var(--colors-gray-a-3);
  }

  &:active {
    background-color: var(--colors-gray-a-4);
  }
`;
