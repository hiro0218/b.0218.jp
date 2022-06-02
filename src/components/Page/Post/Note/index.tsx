import { HiOutlineInformationCircle } from 'react-icons/hi';

import { Post } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = Pick<Post, 'note'>;

const PostNote = ({ note }: Props) => {
  if (!note) {
    return null;
  }

  return (
    <PostNoteRoot>
      <HiOutlineInformationCircle />
      <div dangerouslySetInnerHTML={{ __html: note }} />
    </PostNoteRoot>
  );
};

export default PostNote;

const PostNoteRoot = styled.div`
  display: flex;
  align-items: center;
  padding: var(--space-sm) var(--space-xs);
  border: 1px solid var(--borders-6);
  border-radius: 0.25rem;
  background-color: var(--backgrounds-2);
  color: var(--text-11);
  line-height: 1.875;

  svg {
    flex-shrink: 0;
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.25em;
    color: inherit;
  }
`;
