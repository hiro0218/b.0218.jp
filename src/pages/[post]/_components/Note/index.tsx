import { Stack as _Stack } from '@/components/UI/Layout';
import type { PostProps } from '@/types/source';
import { ICON_SIZE_MD, InfoCircledIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';

type Props = Pick<PostProps, 'note'>;

function PostNote({ note }: Props) {
  return (
    <Stack as="aside" direction="horizontal" space={2}>
      <InfoCircledIcon height={ICON_SIZE_MD} width={ICON_SIZE_MD} />
      <div dangerouslySetInnerHTML={{ __html: note }} />
    </Stack>
  );
}

export default PostNote;

const Stack = styled(_Stack)`
  align-items: center;
  padding: var(--space-3);
  color: var(--text-11);
  background-color: var(--backgrounds-2);
  border-left: var(--space-1) solid var(--borders-6);
  border-radius: var(--border-radius-4);

  a {
    &:hover {
      text-decoration: underline;
    }
  }

  svg {
    flex-shrink: 0;
  }
`;
