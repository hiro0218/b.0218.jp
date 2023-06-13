import { memo } from 'react';

import { Anchor as _Anchor } from '@/components/UI/Anchor';
import { TAG_VIEW_LIMIT } from '@/constant';
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
      {tags
        .sort((a, b) => {
          if (b.count === undefined) return -1;
          if (a.count === undefined) return 1;

          return b.count - a.count;
        })
        .map(({ slug, count }) => {
          const TagComponent = Number(count) >= TAG_VIEW_LIMIT ? Anchor : Anchor.withComponent('span');

          return (
            <TagComponent href={`/tags/${slug}`} key={slug} passHref prefetch={false}>
              {slug}
            </TagComponent>
          );
        })}
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
