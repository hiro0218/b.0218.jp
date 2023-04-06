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
          href={`/tags/${slug}`}
          key={slug}
          passHref
          prefetch={false}
          title={count ? `${slug}: ${count}件` : `tag: ${slug}`}
        >
          {slug}
        </Anchor>
      ))}
    </>
  );
});

export default PostTag;

export const PostTagAnchorStyle = css`
  align-items: center;
  align-self: flex-start;
  padding: var(--space-1);
  font-size: var(--font-size-sm);
  line-height: 1;
  color: var(--text-11);
  text-align: center;
  white-space: nowrap;
  background-color: var(--component-backgrounds-3A);
  border-radius: var(--border-radius-4);

  &:hover {
    background-color: var(--component-backgrounds-4A);
  }

  &:active {
    background-color: var(--component-backgrounds-5A);
  }

  &::before {
    content: '#';
  }
`;

const Anchor = styled(_Anchor)`
  ${PostTagAnchorStyle}
`;

export const PostTagGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);

  ${Anchor} {
    flex: 1 1 auto;
  }
`;
