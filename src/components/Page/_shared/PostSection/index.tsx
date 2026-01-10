import type { JSX } from 'react';
import ArticleCard from '@/components/UI/ArticleCard';
import Heading from '@/components/UI/Heading';
import { Grid, Stack } from '@/components/UI/Layout';
import { LinkMore } from '@/components/UI/LinkMore';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { ArticleSummary, PostSummary } from '@/types/source';
import { containerType } from '@/ui/styled/utilities';

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  posts: (PostSummary | (ArticleSummary & { tags?: string[] }))[];
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
  prefetch = false,
}: Props) => {
  if (posts.length === 0) {
    return null;
  }

  // 次のheadingLevelを取得
  const nextHeadingLevel = `h${Number(headingLevel[1]) + 1}` as Props['headingLevel'];

  return (
    <Stack as={as} gap={2}>
      {!!heading && (
        <Heading
          as={headingLevel}
          isWeightNormal={headingWeight === 'normal'}
          textSide={href && <LinkMore href={href} text="すべて見る" />}
        >
          {heading}
        </Heading>
      )}
      <Grid className={containerType} gap={2}>
        {posts.map(({ date, slug, tags, title, updated }) => {
          const link = convertPostSlugToPath(slug);

          return (
            <ArticleCard
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
    </Stack>
  );
};
