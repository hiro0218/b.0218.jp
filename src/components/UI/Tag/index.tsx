import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { css, styled } from '@/ui/styled';

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

export const PostTagAnchorStyle = css`
  flex: 1 1 auto;
  align-items: center;
  align-self: flex-start;
  padding: var(--space-1);
  line-height: 1;
  color: var(--text-11);
  text-align: center;
  white-space: nowrap;
  background-color: var(--component-backgrounds-3A);
  border-radius: var(--border-radius-4);

  &:hover {
    color: var(--text-12);
    background-color: var(--component-backgrounds-4A);
  }

  &::before {
    content: '#';
  }
`;

const Anchor = styled(_Anchor)`
  ${PostTagAnchorStyle}
`;
