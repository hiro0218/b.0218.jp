import type { JSX } from 'react';
import { LinkMore } from '@/components/Page/Home';
import Heading from '@/components/UI/Heading';
import { Box, Grid } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { convertPostSlugToPath } from '@/lib/url';
import type { PostListProps, TermsPostListProps } from '@/types/source';
import { containerType } from '@/ui/styled/utilities';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  posts: (PostListProps | (TermsPostListProps & { tags?: string[] }))[];
  href?: string;
  as?: keyof JSX.IntrinsicElements;
  prefetch?: boolean;
};

export const PostSection = ({
  as = 'section',
  heading,
  headingLevel = 'h2',
  headingWeight = 'normal',
  href,
  posts,
  prefetch,
}: Props) => {
  if (posts.length === 0) {
    return null;
  }

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
      <Box className={containerType} mt={2}>
        <Grid gap={2}>
          {posts.map(({ date, slug, tags, title, updated }) => {
            const link = convertPostSlugToPath(slug);

            return (
              <LinkCard
                date={date}
                key={slug}
                link={link}
                prefetch={prefetch}
                tags={tags}
                title={title}
                titleTagName={nextHeadingLevel}
                updated={updated}
              />
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
