import { Post } from '@/types/source';
import { RxInfoCircled } from '@/ui/icons';
import { styled } from '@/ui/styled';

type Props = Pick<Post, 'note'>;

const PostNote = ({ note }: Props) => {
  if (!note) {
    return null;
  }

  return (
    <PostNoteRoot>
      <RxInfoCircled size={24} />
      <div dangerouslySetInnerHTML={{ __html: note }} />
    </PostNoteRoot>
  );
};

export default PostNote;

const PostNoteRoot = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-2);
  color: var(--text-11);
  background-color: var(--backgrounds-2);
  border: 1px solid var(--borders-6);
  border-radius: var(--border-radius-4);

  svg {
    flex-shrink: 0;
    margin-right: var(--space-half);
  }
`;
