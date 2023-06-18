import type { PostProps } from '@/types/source';
import { ICON_SIZE_SM, InfoCircledIcon } from '@/ui/icons';
import { styled } from '@/ui/styled';

type Props = Pick<PostProps, 'note'>;

function PostNote({ note }: Props) {
  if (!note) {
    return null;
  }

  return (
    <PostNoteRoot>
      <InfoCircledIcon height={ICON_SIZE_SM} width={ICON_SIZE_SM} />
      <div dangerouslySetInnerHTML={{ __html: note }} />
    </PostNoteRoot>
  );
}

export default PostNote;

const PostNoteRoot = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-11);
  background-color: var(--backgrounds-2);
  border-left: 4px solid var(--borders-6);
  border-radius: var(--border-radius-4);

  a {
    &:hover {
      text-decoration: underline;
    }
  }

  svg {
    flex-shrink: 0;
    margin-right: var(--space-1);
  }
`;
