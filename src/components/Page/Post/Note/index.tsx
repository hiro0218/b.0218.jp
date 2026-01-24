import { Stack } from '@/components/UI/Layout';
import type { Post } from '@/types/source';
import { ICON_SIZE_SM, InfoCircledIcon } from '@/ui/icons';
import { css } from '@/ui/styled';

type Props = Pick<Post, 'note'>;

function PostNote({ note }: Props) {
  return (
    <Stack align="center" as="aside" className={ContainerStyle} direction="horizontal" gap="½">
      <InfoCircledIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      <div className={contentStyle} dangerouslySetInnerHTML={{ __html: note }} />
    </Stack>
  );
}

export default PostNote;

const ContainerStyle = css`
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

const contentStyle = css`
  flex: 1;
`;
