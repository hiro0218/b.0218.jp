import Heading from '@/components/UI/Heading';
import { Grid, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { LinkMore } from '@/pages/_components/home';
import type { PostListProps, TermsPostListProps } from '@/types/source';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  posts: PostListProps[] | (TermsPostListProps & { tags?: string[] })[];
  href?: string;
  as?: keyof JSX.IntrinsicElements;
};

export const PostSection = ({
  as = 'section',
  heading,
  headingLevel = 'h2',
  headingWeight = 'normal',
  href,
  posts,
}: Props) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <Stack as={as} space={2}>
      {!!heading && (
        <Heading
          as={headingLevel}
          isWeightNormal={headingWeight === 'normal'}
          text={heading}
          textSide={href && <LinkMore href={href} text="すべて見る" />}
        />
      )}
      <Grid gap={2}>
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
    </Stack>
  );
};
