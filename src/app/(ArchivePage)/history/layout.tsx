import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { getMetadata } from '@/app/_metadata';
import { SITE_URL } from '@/constants';

const slug = 'history';
const title = 'History';
const pageTitle = '閲覧履歴';
const description = '閲覧した記事の履歴';

export const metadata: Metadata = getMetadata({
  title,
  description: `${pageTitle} - ${description}`,
  url: `${SITE_URL}/${slug}`,
});

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return children;
}
