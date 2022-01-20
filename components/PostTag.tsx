import styled from '@emotion/styled';
import Link from 'next/link';
import { FC } from 'react';

export type Props = {
  slug: string;
  count?: number;
};

type PostTagProps = {
  tags: Array<Props>;
};

const PostTag: FC<PostTagProps> = ({ tags }) => {
  if (tags?.length === 0) return <></>;

  return (
    <>
      {tags?.map(({ slug, count }, index) => (
        <Link href={'/tags/' + slug} prefetch={false} passHref key={index}>
          <PostTagAnchor title={count ? `${slug}: ${count}件` : 'tag: ' + slug}>{slug}</PostTagAnchor>
        </Link>
      ))}
    </>
  );
};

export default PostTag;

const PostTagAnchor = styled.a`
  display: block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.15rem;
  background-color: var(--component-backgrounds-3);
  color: var(--text-11);
  font-size: var(--font-size-sm);

  &:hover {
    background-color: var(--component-backgrounds-4);
  }

  &::before {
    content: '#';
  }
`;
