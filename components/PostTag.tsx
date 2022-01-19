import styled from '@emotion/styled';
import Link from 'next/link';
import { FC } from 'react';

import { Post } from '@/types/source';

type Props = Pick<Post, 'tags'>;

const PostTag: FC<Props> = ({ tags }) => {
  if (tags?.length === 0) return <></>;

  return (
    <PostTagRoot>
      {tags?.map((tag, index) => (
        <PostTagItem key={index}>
          <Link href={'/tags/' + tag} prefetch={false} passHref>
            <PostTagAnchor title={'tag: ' + tag}>{tag}</PostTagAnchor>
          </Link>
        </PostTagItem>
      ))}
    </PostTagRoot>
  );
};

export default PostTag;

const PostTagRoot = styled.div`
  display: flex;
`;

const PostTagItem = styled.div`
  &:not(:last-child) {
    margin-right: 0.25em;
  }
`;

const PostTagAnchor = styled.a`
  display: block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.15rem;
  background-color: var(--component-backgrounds-3);
  color: var(--text-11);
  font-size: var(--font-size-sm);
  line-height: 1.25;

  &:hover {
    background-color: var(--component-backgrounds-4);
  }

  &::before {
    content: '#';
  }
`;
