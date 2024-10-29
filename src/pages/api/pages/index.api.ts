import type { PageProps } from '@/types/source';
import type { NextApiRequest, NextApiResponse } from 'next';
import pages from '~/dist/pages.json';

type ResponseData = PageProps[] | PageProps;

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { slug } = req.query;

  if (slug === undefined) {
    return res.status(200).json(pages);
  }

  const page = pages.find((page) => page.slug === slug);

  res.status(200).json(page);
}
