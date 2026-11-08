import { DropdownMenu } from '@/components/UI/DropdownMenu';
import { ICON_SIZE_SM } from '@/ui/iconSizes';
import { GitHubLogo } from '@/ui/icons/GitHubLogo';
import { css } from '@/ui/styled';

type Props = {
  slug: string;
};

const CONTENT_REPOSITORY_URL = 'https://github.com/hiro0218/article';

export function PostEdit({ slug }: Props) {
  const filePath = `master/_posts/${slug}.md`;
  const editUrl = `${CONTENT_REPOSITORY_URL}/edit/${filePath}`;
  const rawUrl = `${CONTENT_REPOSITORY_URL}/blob/${filePath}`;

  return (
    <aside>
      <div className={insetStyle}>
        <DropdownMenu title={<GitHubLogo height={ICON_SIZE_SM} width={ICON_SIZE_SM} />} triggerLabel="Feedback">
          <a className={anchorStyle} href={editUrl} rel="noreferrer" target="_blank">
            Edit on GitHub
          </a>
          <a className={anchorStyle} href={rawUrl} rel="noreferrer" target="_blank">
            View raw file on GitHub
          </a>
        </DropdownMenu>
      </div>
    </aside>
  );
}

// 負の margin を aside 自身に付けない。部品のルートに外側の余白を持たせない（Zero Margin Principle）ため
const insetStyle = css`
  margin: calc((var(--control-min-size) - var(--sizes-icon-sm)) / -2);
`;

const anchorStyle = css`
  font-size: var(--font-sizes-sm);
  color: var(--colors-gray-1000);

  &:hover {
    background-color: var(--colors-gray-a-100);
  }

  &:active {
    background-color: var(--colors-gray-a-200);
  }
`;
