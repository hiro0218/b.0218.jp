import { memo } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { TAG_VIEW_LIMIT } from '@/constant';
import { styled } from '@/ui/styled/static';

export type Props = {
  slug: string;
  count?: number;
};

type PostTagProps = {
  tags: Props[];
  hasRelTag?: boolean;
};

const PostTag = memo(function PostTag({ tags, hasRelTag = true }: PostTagProps) {
  if (tags?.length === 0) {
    return null;
  }

  return tags
    .sort((a, b) => {
      if (b.count === undefined) return -1;
      if (a.count === undefined) return 1;

      return b.count - a.count;
    })
    .map(({ slug, count }) => {
      const isAnchor = count >= TAG_VIEW_LIMIT;

      return isAnchor ? (
        <Anchor
          className="post-tag-anchor"
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
        <DisabledTagAnchor aria-hidden="true" className="post-tag-anchor" key={slug}>
          {slug}
        </DisabledTagAnchor>
      );
    });
});

export default PostTag;

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  padding: 0 var(--space-½);
  margin-left: var(--space-1);
  font-family: var(--font-family-monospace);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-sm);
  user-select: none;
  background-color: var(--color-gray-3A);
  border-radius: var(--border-radius-8);
`;

const DisabledTagAnchor = styled.span`
  &:hover {
    cursor: not-allowed;
  }
`;
