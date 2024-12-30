import { memo } from 'react';

import { Anchor } from '@/components/UI/Anchor';
import { TAG_VIEW_LIMIT } from '@/constant';
import { css, styled } from '@/ui/styled';

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
        <TagAnchor
          href={`/tags/${slug}`}
          key={slug}
          {...(hasRelTag && {
            rel: 'tag',
          })}
        >
          {slug}
          <Count aria-hidden="true">{count}</Count>
        </TagAnchor>
      ) : (
        <DisabledTagAnchor aria-hidden="true" key={slug}>
          {slug}
        </DisabledTagAnchor>
      );
    });
});

export default PostTag;

export const PostTagAnchorStyle = css`
  display: inline-flex;
  justify-content: center;
  padding: var(--space-½) var(--space-2);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-md);
  color: var(--color-gray-11);
  text-align: center;
  white-space: nowrap;
  background-color: var(--color-gray-3A);
  border-radius: var(--border-radius-8);
`;

const Count = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1/1;
  padding: var(--space-½);
  margin-left: var(--space-1);
  font-family: var(--font-family-monospace);
  font-size: var(--font-size-xs);
  line-height: var(--line-height-sm);
  user-select: none;
  background-color: var(--color-gray-3A);
  border-radius: var(--border-radius-8);
`;

const TagAnchor = styled(Anchor)`
  ${PostTagAnchorStyle}

  &:hover {
    background-color: var(--color-gray-4A);
  }

  &:active {
    background-color: var(--color-gray-5A);
  }
`;

const DisabledTagAnchor = styled.span`
  ${PostTagAnchorStyle}

  &:hover {
    cursor: not-allowed;
  }
`;
