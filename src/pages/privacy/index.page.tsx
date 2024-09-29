import type { NextPage } from 'next';
import { createGetLayout } from '../_layouts/SinglePageLayout';

export default function Privacy(): NextPage {
  return null;
}

Privacy.getLayout = createGetLayout({
  slug: 'privacy',
  title: {
    heading: 'Privacy',
    paragraph: 'プライバシーポリシー',
  },
});
