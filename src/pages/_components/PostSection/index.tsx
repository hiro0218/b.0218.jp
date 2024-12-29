import Heading from '@/components/UI/Heading';
import { Grid, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { LinkMore } from '@/pages/_components/home';
import type { PostListProps, TermsPostListProps } from '@/types/source';
import type { ElementType } from 'react';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  posts: (PostListProps | (TermsPostListProps & { tags?: string[] }))[];
  href?: string;
  as?: ElementType;
  updateTarget?: 'updated' | 'date' | undefined;
};

const getYMD = (date?: string) => date?.split('T')[0];

export const PostSection = ({
  as = 'section',
  heading,
  headingLevel = 'h2',
  headingWeight = 'normal',
  href,
  updateTarget,
  posts,
}: Props) => {
  if (posts.length === 0) {
    return null;
  }

  // posts.(date | updated)の中で最新日付を取得
  const latestUpdated =
    updateTarget !== undefined &&
    posts
      .map((post: PostListProps) => getYMD(updateTarget === 'updated' ? post.updated : post.date))
      .sort((a, b) => b.localeCompare(a))[0];

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
        {posts.map(({ date, slug, tags, title, updated }) => {
          const targetDate = updateTarget === 'updated' ? updated : date;
          const showNewLabel = updateTarget !== undefined && getYMD(targetDate) === latestUpdated;

          return (
            <LinkCard
              date={date}
              key={slug}
              link={`${slug}.html`}
              tags={tags}
              title={title}
              titleTagName="h4"
              updated={updated}
              showNewLabel={showNewLabel}
            />
          );
        })}
      </Grid>
    </Stack>
  );
};
