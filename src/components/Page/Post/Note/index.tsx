import { Stack } from '@/components/UI/Layout';
import type { PostProps } from '@/types/source';
import { ICON_SIZE_SM, InfoCircledIcon } from '@/ui/icons';
import { css } from '@/ui/styled/static';

type Props = Pick<PostProps, 'note'>;

function PostNote({ note }: Props) {
  return (
    <Stack as="aside" className={ContainerStyle} direction="horizontal" space={1}>
      <InfoCircledIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      <div dangerouslySetInnerHTML={{ __html: note }} />
    </Stack>
  );
}

export default PostNote;

const ContainerStyle = css`
  align-items: center;
  padding: var(--space-2);
  font-size: var(--font-sizes-sm);
  line-height: var(--line-heights-md);
  color: var(--colors-accent-11);
  background-color: var(--colors-accent-3);
  border-radius: var(--radii-8);

  a {
    &:hover {
      text-decoration: underline;
    }
  }

  svg {
    flex-shrink: 0;
    path {
      fill: var(--colors-post-note-icon);
    }
  }
`;
