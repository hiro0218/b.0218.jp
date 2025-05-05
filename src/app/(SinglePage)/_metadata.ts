import type { Metadata } from 'next/types';
import { openGraph } from '@/app/_metadata';
import { SITE_NAME } from '@/constant';

type Props = {
  title: string;
  description: string;
  url: string;
};

export const getMetadata = ({ title, description, url }: Props): Metadata => {
  const pageTitle = `${title} - ${SITE_NAME}`;

  return {
    title: pageTitle,
    description: description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...openGraph,
      url: url,
      title: pageTitle,
      description: description,
    },
  };
};
