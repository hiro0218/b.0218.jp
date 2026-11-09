import type { JSX } from 'react';
import { ArticleCard } from '@/components/Page/_shared/ArticleCard';
import { PostTimeline } from '@/components/Page/_shared/PostTimeline';
import { Heading, type HeadingLevel } from '@/components/UI/Heading';
import { Grid } from '@/components/UI/Layout/Grid';
import { Stack } from '@/components/UI/Layout/Stack';
import { LinkMore } from '@/components/UI/LinkMore';
import { getPrimaryCategory } from '@/lib/tag/category';
import { getTagCategoriesJson } from '@/lib/tag/derived';
import { convertPostSlugToPath } from '@/lib/utils/url';
import type { ArticleSummary, PostSummary } from '@/types/source';
import { css } from '@/ui/styled';

const CHILD_HEADING_LEVEL = { h2: 'h3', h3: 'h4', h4: 'h5', h5: 'h6' } as const satisfies Partial<
  Record<HeadingLevel, HeadingLevel>
>;

type Props = {
  heading?: string;
  headingLevel?: keyof typeof CHILD_HEADING_LEVEL;
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
  href,
  posts,
  prefetch = false,
  layout = 'card',
}: Props) => {
  if (posts.length === 0) {
    return null;
  }

  // 見出しの有無を問わず、題名は見出しの次の段に固定しない。見出しの無い一覧（/popular・タグのページ）が、h1 → h3 と段を飛ばすため
  const titleTagName = heading ? CHILD_HEADING_LEVEL[headingLevel] : headingLevel;
  const categoryMap = getTagCategoriesJson();

  // timeline の見出しと一覧の間隔を row（32）にしない。行の上下の余白で、行どうしの間は 48 になる。32 では見出しの文字から 1 行目の文字までが、行どうしの間より近い。見出しが一覧全体でなく 1 行目に付いて見えるため。
  // 見出しの太字（isBold）を外さない。timeline の題名が 400 なので、太さで見出しと区別できなくなるため
  return (
    <Stack as={as} gap={layout === 'timeline' ? 700 : 500}>
      {!!heading && (
        <Heading as={headingLevel} isBold textSide={href && <LinkMore href={href} text="すべて見る" />}>
          {heading}
        </Heading>
      )}
      {layout === 'timeline' ? (
        <PostTimeline posts={posts} prefetch={prefetch} titleTagName={titleTagName} />
      ) : (
        <Grid className={cardGridStyle} minItemWidth="13rem">
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
                titleTagName={titleTagName}
                updated={updated}
              />
            );
          })}
        </Grid>
      )}
    </Stack>
  );
};

// カード 1 枚の最小幅（minItemWidth）を 14〜16rem（224〜256px）にしない。3 枚は 720〜816px 要り、記事の列が 691 の 768px と 689.6 の 1024px で 2 枚に減るため。
// gap を container query で切り替えない。container query は祖先の幅を見る。Grid 自身の幅で gap を切り替えられないため
const cardGridStyle = css`
  gap: var(--spacing-300);

  @media (min-width: 48rem) {
    gap: var(--spacing-400);
  }
`;
