import type { JSX } from 'react';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import ArticleCard from '@/components/UI/ArticleCard';
import Heading from '@/components/UI/Heading';
import { Grid, Stack } from '@/components/UI/Layout';
import { LinkMore } from '@/components/UI/LinkMore';
import { getPrimaryCategory } from '@/lib/tag/category';
import { getTagCategoriesJson } from '@/lib/tag/data';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { ArticleSummary, PostSummary } from '@/types/source';

const categoryMap = getTagCategoriesJson();

type Props = {
  heading?: string;
  headingLevel?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingWeight?: 'bold' | 'normal';
  posts: (PostSummary | (ArticleSummary & { tags?: string[] }))[];
  href?: string;
  as?: keyof JSX.IntrinsicElements;
  prefetch?: boolean;
  layout?: 'card' | 'timeline';
};

export const PostSection = ({
  as = 'section',
  heading,
  headingLevel = 'h2',
  headingWeight = 'normal',
  href,
  posts,
  prefetch = false,
  layout = 'card',
}: Props) => {
  if (posts.length === 0) {
    return null;
  }

  // 次のheadingLevelを取得
  const nextHeadingLevel = `h${Number(headingLevel[1]) + 1}` as Props['headingLevel'];

  return (
    <Stack as={as} gap={3}>
      {!!heading && (
        <Heading
          as={headingLevel}
          isBold={headingWeight === 'bold'}
          textSide={href && <LinkMore href={href} text="すべて見る" />}
        >
          {heading}
        </Heading>
      )}
      {layout === 'timeline' ? (
        <PostTimeline posts={posts} prefetch={prefetch} />
      ) : (
        <Grid columns="auto-fit" gap={2}>
          {posts.map(({ date, slug, tags, title, updated }) => {
            const link = convertPostSlugToPath(slug);
            const category = getPrimaryCategory(tags, categoryMap);

            return (
              <ArticleCard
                category={category}
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
      )}
    </Stack>
  );
};
