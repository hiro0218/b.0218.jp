import type { Post } from '@/types/source';
import { ICON_SIZE_SM, InfoCircledIcon } from '@/ui/icons';
import { css } from '@/ui/styled';

type Props = Pick<Post, 'note'>;

function PostNote({ note }: Props) {
  return (
    <aside className={ContainerStyle}>
      <InfoCircledIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      <div dangerouslySetInnerHTML={{ __html: note }} />
    </aside>
  );
}

export default PostNote;

const ContainerStyle = css`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--spacing-½);
  align-items: center;
  padding: var(--spacing-2);
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-md);
  color: var(--colors-accent-1200);
  background-color: var(--colors-accent-200);
  border-radius: var(--radii-8);

  a {
    &:hover {
      text-decoration: underline;
    }
  }

  svg {
    flex-shrink: 0;
    height: 1lh;

    path {
      fill: var(--colors-post-note-icon);
    }
  }
`;
