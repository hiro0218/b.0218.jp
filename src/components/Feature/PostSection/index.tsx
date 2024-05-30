import Heading from '@/components/UI/Heading';
import { Grid, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import type { PostListProps, TermsPostListProps } from '@/types/source';
import { styled } from '@/ui/styled';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  posts: PostListProps[] | TermsPostListProps[];
  as?: keyof JSX.IntrinsicElements;
};

export const PostSection = ({
  as = 'section',
  heading,
  headingLevel = 'h2',
  headingWeight = 'normal',
  posts,
}: Props) => {
  if (posts.length === 0) {
    return null;
  }

  return (
    <Stack as={as} space={2}>
      {!!heading && <Heading as={headingLevel} isWeightNormal={headingWeight === 'normal'} text={heading} />}
      <Grid>
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

export const PostSectionFooter = styled.div`
  text-align: center;
`;
