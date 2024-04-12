import { Grid } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import type { PostListProps } from '@/types/source';

type Props = {
  posts: PostListProps[];
};

export const PostSection = ({ posts }: Props) => {
  return (
    <Grid gap={1}>
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
    </Grid>
  );
};
