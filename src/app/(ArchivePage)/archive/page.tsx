import type { Metadata } from 'next';
import { getMetadata } from '@/app/_metadata';
import { StructuredData } from '@/components/Functional/StructuredData';
import { pageSections } from '@/components/Page/_shared/pageSections';
import { ArchiveIntro } from '@/components/Page/Archive/ArchiveIntro';
import { ArchiveTimelinesByYear } from '@/components/Page/Archive/ArchiveTimelinesByYear';
import { Chart, type YearPostCount } from '@/components/Page/Archive/Chart';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constants';
import { getCollectionPageStructured } from '@/lib/domain/json-ld';
import { getDateAndUpdatedToSimpleFormat } from '@/lib/post/date';
import { getPostsListJson } from '@/lib/source/post';
import type { ArchivesByYear, PostSummary } from '@/types/source';

const getYear = (date: PostSummary['date']) => Number(date.slice(0, 4));

const groupPostsByYear = (posts: PostSummary[]): ArchivesByYear => {
  const transformedPosts = posts.map((post) => ({
    ...post,
    ...getDateAndUpdatedToSimpleFormat(post.date),
  }));

  return Object.groupBy(transformedPosts, (post) => String(getYear(post.date))) as ArchivesByYear;
};

// アーカイブは完全な記事索引として扱うため、宣伝用の棚 (getFilteredPosts) が行うタグ除外は適用しない。
// noindex (サンプル記事等、一覧から隠すべき投稿) だけを除く。
const posts = getPostsListJson().filter((post) => !post.noindex);
const archives = groupPostsByYear(posts);
// チャートと年別セクションで、年の並びと記事数を求め直さない。それぞれで求めると、並びや件数がずれうる
const years: YearPostCount[] = Object.keys(archives)
  .toReversed()
  .map((year) => ({ year, postCount: archives[year].length }));
const totalPosts = posts.length;
const slug = 'archive';
const title = '記事一覧';
const paragraph = `${totalPosts}件の記事`;
const description = `${title} - ${paragraph}`;

export const metadata: Metadata = getMetadata({
  title,
  description,
  url: `${SITE_URL}/${slug}`,
});

export default function Page() {
  return (
    <>
      <StructuredData
        data={getCollectionPageStructured({
          name: title,
          description,
        })}
      />
      <article className={pageSections}>
        <ArchiveIntro>
          <Title paragraph={paragraph}>{title}</Title>

          <Chart totalPosts={totalPosts} years={years} />
        </ArchiveIntro>

        <ArchiveTimelinesByYear archives={archives} years={years} />
      </article>
    </>
  );
}
