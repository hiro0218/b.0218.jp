import { DropdownMenu } from '@/components/UI/DropdownMenu';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { GitHubLogo } from '@/ui/icons/GitHubLogo';
import { css } from '@/ui/styled';

type Props = {
  slug: string;
};

export function PostEdit({ slug }: Props) {
  return (
    <aside>
      <DropdownMenu
        menuHorizontalPosition="right"
        title={<GitHubLogo height={ICON_SIZE_SM} width={ICON_SIZE_SM} />}
        triggerLabel="Feedback"
      >
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
      </DropdownMenu>
    </aside>
  );
}

const anchorStyle = css`
  display: flex;
  align-items: center;
  padding: var(--spacing-75) var(--spacing-100);
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-sm);
  color: var(--colors-gray-1000);
  border-radius: var(--radii-xs);

  &:hover {
    background-color: var(--colors-gray-a-100);
  }

  &:active {
    background-color: var(--colors-gray-a-200);
  }
`;
