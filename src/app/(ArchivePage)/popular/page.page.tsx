import { getMetadata } from '@/app/(ArchivePage)/metadata';
import { getData } from '@/app/(ArchivePage)/popular/getData';
import { Sidebar, Stack } from '@/components/UI/Layout';
import LinkCard from '@/components/UI/LinkCard';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constant';
import { convertPostSlugToPath } from '@/lib/url';
import type { Metadata } from 'next/types';

const { popularPosts } = getData();
const slug = 'popular';
const title = 'Popular';
const pageTitle = '注目記事';
const description = `${popularPosts.length}件の記事（過去7日間）`;

export const metadata: Metadata = getMetadata({
  title,
  description: `${pageTitle} - ${description}`,
  url: `${SITE_URL}/${slug}`,
});

export default async function Page() {
  return (
    <>
      <Title heading={title} paragraph={description} />
      <Sidebar>
        <Sidebar.Side>
          <Sidebar.Title>{pageTitle}</Sidebar.Title>
        </Sidebar.Side>
        <Sidebar.Main>
          <Stack>
            {popularPosts.map(({ date, slug, tags, title, updated }) => {
              const link = convertPostSlugToPath(slug);
              return <LinkCard date={date} key={slug} link={link} tags={tags} title={title} updated={updated} />;
            })}
          </Stack>
        </Sidebar.Main>
      </Sidebar>
    </>
  );
}
