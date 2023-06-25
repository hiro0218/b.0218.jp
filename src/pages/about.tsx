import { createGetLayout } from '@/components/Layouts/SinglePageLayout';

export default function About() {
  return null;
}

About.getLayout = createGetLayout({
  slug: 'about',
  title: {
    heading: 'About',
    paragraph: 'サイトと運営者について',
  },
});
