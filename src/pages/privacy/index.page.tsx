import { createGetLayout } from '../_layouts/SinglePageLayout';

export default function Privacy() {
  return null;
}

Privacy.getLayout = createGetLayout({
  slug: 'privacy',
  title: {
    heading: 'Privacy',
    paragraph: 'プライバシーポリシー',
  },
});
