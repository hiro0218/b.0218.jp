import { css } from '@emotion/react';
import { FC } from 'react';

import { Post } from '@/types/source';

type Props = Pick<Post, 'note'>;

const PostNote: FC<Props> = ({ note }) => {
  if (!note) {
    return <></>;
  }

  return <div css={cssPostNote} dangerouslySetInnerHTML={{ __html: note }}></div>;
};

export default PostNote;

const cssPostNote = css`
  display: flex;
  padding: calc(var(--margin-base) * 0.6) calc(var(--margin-base) * 0.8);
  border: 2px solid var(--gray-1);
  border-radius: 0.25rem;
  line-height: 1.8;

  &::before {
    content: 'Note:';
    margin-right: 0.25em;
    font-weight: bold;
  }

  &:empty {
    display: none;
  }

  a {
    text-decoration: underline;
  }
`;
