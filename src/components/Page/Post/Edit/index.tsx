import { DropdownMenu } from '@/components/UI/DropdownMenu/index';
import { GitHubLogo, ICON_SIZE_SM } from '@/ui/icons';
import { css } from '@/ui/styled';

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
            <GitHubLogo height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
          </>
        }
      >
        <>
          <a
            className={anchorStyle}
            href={`https://github.com/hiro0218/article/edit/master/_posts/${slug}.md`}
            rel="noreferrer"
            target="_blank"
          >
            Edit on GitHub
          </a>
          <a
            className={anchorStyle}
            href={`https://github.com/hiro0218/article/blob/master/_posts/${slug}.md`}
            rel="noreferrer"
            target="_blank"
          >
            View raw file on GitHub
          </a>
        </>
      </DropdownMenu>
    </aside>
  );
}

export default PostEdit;

const anchorStyle = css`
  display: flex;
  align-items: center;
  padding: var(--spacing-½) var(--spacing-1);
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-1000);
  border-radius: var(--radii-2);

  &:hover {
    background-color: var(--colors-gray-a-100);
  }

  &:active {
    background-color: var(--colors-gray-a-200);
  }
`;
