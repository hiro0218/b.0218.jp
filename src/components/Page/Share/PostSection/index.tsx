import { LinkMore } from '@/components/Page/Home';
import Heading from '@/components/UI/Heading';
import { Box, Grid } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { convertPostSlugToPath } from '@/lib/url';
import type { PostListProps, TermsPostListProps } from '@/types/source';
import { containerType } from '@/ui/styled/utilities';
import type { JSX } from 'react';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  posts: (PostListProps | (TermsPostListProps & { tags?: string[] }))[];
  href?: string;
  as?: keyof JSX.IntrinsicElements;
  updateTarget?: 'updated' | 'date' | undefined;
  prefetch?: boolean;
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
  prefetch,
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

  // 次のheadingLevelを取得
  const nextHeadingLevel = `h${Number(headingLevel[1]) + 1}` as Props['headingLevel'];

  return (
    <Box as={as}>
      {!!heading && (
        <Heading
          as={headingLevel}
          isWeightNormal={headingWeight === 'normal'}
          textSide={href && <LinkMore href={href} text="すべて見る" />}
        >
          {heading}
        </Heading>
      )}
      <Box mt={2} className={containerType}>
        <Grid gap={2}>
          {posts.map(({ date, slug, tags, title, updated }) => {
            const targetDate = updateTarget === 'updated' ? updated : date;
            const showNewLabel = updateTarget !== undefined && getYMD(targetDate) === latestUpdated;
            const link = convertPostSlugToPath(slug);

            return (
              <LinkCard
                date={date}
                key={slug}
                link={link}
                tags={tags}
                title={title}
                titleTagName={nextHeadingLevel}
                updated={updated}
                showNewLabel={showNewLabel}
                prefetch={prefetch}
              />
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
