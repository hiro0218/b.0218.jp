import type { ComponentProps } from 'react';

import { Columns, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import type { PostListProps } from '@/types/source';

type Props = {
  posts: PostListProps[];
  title: ComponentProps<typeof Columns>['title'];
  titleTagName: ComponentProps<typeof Columns>['titleTagName'];
};

export const PostSection = ({ posts, title, titleTagName = 'h3' }: Props) => {
  return (
    <Columns title={title} titleTagName={titleTagName}>
      <Stack space="½">
        {posts.map(({ date, slug, tags, title, updated }) => (
          <LinkCard date={date} key={slug} link={`${slug}.html`} tags={tags} title={title} updated={updated} />
        ))}
      </Stack>
    </Columns>
  );
};
