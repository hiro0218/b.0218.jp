import { type ComponentProps, useMemo } from 'react';

import { Columns, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import type { PostListProps } from '@/types/source';

type Props = {
  posts: PostListProps[];
  title: ComponentProps<typeof Columns>['title'];
  titleTagName: ComponentProps<typeof Columns>['titleTagName'];
  isColumn?: boolean;
};

export const PostSection = ({ posts, title, titleTagName = 'h3', isColumn = true }: Props) => {
  const PostsListComponent = useMemo(() => {
    return (
      <Stack space="½">
        {posts.map(({ date, slug, tags, title, updated }) => (
          <LinkCard
            date={date}
            key={slug}
            link={`${slug}.html`}
            tags={tags}
            title={title}
            titleTagName="h4"
            updated={updated}
          />
        ))}
      </Stack>
    );
  }, [posts]);

  return (
    <>
      {isColumn ? (
        <Columns title={title} titleTagName={titleTagName}>
          {PostsListComponent}
        </Columns>
      ) : (
        <>{PostsListComponent}</>
      )}
    </>
  );
};
