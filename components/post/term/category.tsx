import styled from '@emotion/styled';
import Link from 'next/link';
import { FC } from 'react';

import { Post } from '@/types/source';

type Props = Pick<Post, 'categories'>;

const PostCategory: FC<Props> = ({ categories }) => {
  if (categories?.length === 0) return <></>;

  return (
    <PostCategoryRoot>
      {categories?.map((category, index) => (
        <PostCategoryItem key={index}>
          <Link href={'/categories/' + category} prefetch={false} passHref>
            <PostCategoryAnchor title={'category: ' + category}>{category}</PostCategoryAnchor>
          </Link>
        </PostCategoryItem>
      ))}
    </PostCategoryRoot>
  );
};

export default PostCategory;

const PostCategoryRoot = styled.div`
  display: flex;
  flex-direction: row;
`;

const PostCategoryItem = styled.div`
  &:not(:last-child) {
    margin-right: 0.25em;
  }
`;

const PostCategoryAnchor = styled.a`
  color: var(--text-11);

  &:hover {
    text-decoration: underline;
  }
`;
