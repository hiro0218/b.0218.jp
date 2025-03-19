import { parser } from '@/app/(PostPage)/[slug]/components/Content/inject';
import { getMetadata } from '@/app/(SinglePage)/metadata';
import { Box } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { SITE_URL } from '@/constant';
import { getPagesJson } from '@/lib/posts';
import type { Metadata } from 'next/types';

const pages = getPagesJson();
const slug = 'about';
const title = 'About';
const description = 'サイトと運営者について';

export const metadata: Metadata = getMetadata({
  title,
  description,
  url: `${SITE_URL}/${slug}`,
});

export default async function Page() {
  const { content } = pages.find((page) => slug === page.slug);
  const reactNodeContent = parser(content);

  return (
    <>
      <Title heading={title} paragraph={description} />
      <Box as="article" mt={4} className={'post-content'}>
        {reactNodeContent}
      </Box>
    </>
  );
}
