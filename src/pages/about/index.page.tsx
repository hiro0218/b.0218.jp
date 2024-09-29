import type { NextPage } from 'next';
import { createGetLayout } from '../_layouts/SinglePageLayout';

export default function About(): NextPage {
  return null;
}

About.getLayout = createGetLayout({
  slug: 'about',
  title: {
    heading: 'About',
    paragraph: 'サイトと運営者について',
  },
});
