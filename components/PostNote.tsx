import styled from '@emotion/styled';
import { FC } from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

import { Post } from '@/types/source';

type Props = Pick<Post, 'note'>;

const PostNote: FC<Props> = ({ note }) => {
  if (!note) {
    return <></>;
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
  padding: var(--space-sm) var(--space-x-sm);
  border: 2px solid var(--borders-6);
  border-radius: 0.25rem;
  line-height: 1.8;

  a {
    text-decoration: underline;
  }

  svg {
    flex-shrink: 0;
    width: 1.5em;
    height: 1.5em;
    margin-right: 0.25em;
    color: inherit;
  }
`;
