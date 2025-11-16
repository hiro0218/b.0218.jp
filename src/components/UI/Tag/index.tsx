import { memo } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { TAG_VIEW_LIMIT } from '@/constant';
import { styled } from '@/ui/styled';
import { postTagAnchor } from '@/ui/styled/components';

export type Props = {
  slug: string;
  count?: number;
};

type PostTagProps = {
  tags: Props[];
  hasRelTag?: boolean;
};

const PostTag = memo(function PostTag({ tags, hasRelTag = true }: PostTagProps) {
  const sortedTags = tags.toSorted((a, b) => {
    if (b.count === undefined) return -1;
    if (a.count === undefined) return 1;

    return b.count - a.count;
  });

  if (tags?.length === 0) {
    return null;
  }

  return sortedTags.map(({ slug, count }) => {
    const isAnchor = count >= TAG_VIEW_LIMIT;

    return isAnchor ? (
      <Anchor
        className={postTagAnchor}
        href={`/tags/${slug}`}
        key={slug}
        {...(hasRelTag && {
          rel: 'tag',
        })}
      >
        {slug}
        <Count aria-hidden="true">{count}</Count>
      </Anchor>
    ) : (
      <span aria-hidden="true" className={postTagAnchor} key={slug}>
        {slug}
      </span>
    );
  });
});

export default PostTag;

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  padding: 0 var(--spacing-½);
  margin-left: var(--spacing-1);
  font-family: var(--fonts-family-monospace);
  font-size: var(--font-sizes-xs);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-heights-sm);
  user-select: none;
  background-color: var(--colors-gray-a-3);
  border-radius: var(--radii-8);
`;
