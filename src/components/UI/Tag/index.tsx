import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { styled } from '@/ui/styled';

export type Props = {
  slug: string;
  count?: number;
};

type PostTagProps = {
  tags: Props[];
};

const PostTag = memo(function PostTag({ tags }: PostTagProps) {
  if (tags?.length === 0) {
    return null;
  }

  return (
    <>
      {tags?.map(({ slug, count }) => (
        <Anchor
          href={'/tags/' + slug}
          prefetch={false}
          passHref
          key={slug}
          title={count ? `${slug}: ${count}件` : 'tag: ' + slug}
        >
          {slug}
        </Anchor>
      ))}
    </>
  );
});

export default PostTag;

export const PostTagGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
`;

const Anchor = styled(_Anchor)`
  flex: 1 1 auto;
  align-items: center;
  align-self: flex-start;
  padding: var(--space-1);
  line-height: 1;
  color: var(--text-11);
  text-align: center;
  white-space: nowrap;
  background-color: var(--component-backgrounds-4A);
  border-radius: var(--border-radius-4);

  &:hover {
    background-color: var(--component-backgrounds-5A);
  }

  &::before {
    content: '#';
  }
`;
