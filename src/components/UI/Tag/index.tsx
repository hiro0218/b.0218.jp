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
          title={`${slug} (${count})`}
          {...(hasRelTag && {
            rel: 'tag',
          })}
        >
          {slug}
        </TagAnchor>
      ) : (
        <DisabledTagAnchor key={slug}>{slug}</DisabledTagAnchor>
      );
    });
});

export default PostTag;

export const PostTagAnchorStyle = css`
  padding: var(--space-1) var(--space-2);
  line-height: var(--line-height-xs);
  color: var(--text-11);
  text-align: center;
  white-space: nowrap;
  background-color: var(--component-backgrounds-3A);
  border-radius: var(--border-radius-4);
`;

const TagAnchor = styled(Anchor)`
  ${PostTagAnchorStyle}

  &:hover {
    background-color: var(--component-backgrounds-4A);
  }

  &:active {
    background-color: var(--component-backgrounds-5A);
  }
`;

const DisabledTagAnchor = styled.span`
  ${PostTagAnchorStyle}

  &:hover {
    cursor: not-allowed;
  }
`;
