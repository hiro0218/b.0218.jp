import { getMetadata } from '@/app/(SinglePage)/metadata';
import Content from '@/components/Page/Single/Content';
import { SITE_URL } from '@/constant';
import type { Metadata } from 'next/types';

const slug = 'about';
const title = 'About';
const description = 'サイトと運営者について';

export const metadata: Metadata = getMetadata({
  title,
  description,
  url: `${SITE_URL}/${slug}`,
});

export default async function Page() {
  return <Content title={title} description={description} slug={slug} />;
}
