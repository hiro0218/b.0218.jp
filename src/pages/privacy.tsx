import { createGetLayout } from '@/components/Layouts/SinglePageLayout';

export default function Privacy() {
  return <></>;
}

Privacy.getLayout = createGetLayout({
  slug: 'privacy',
  title: {
    heading: 'Privacy',
    paragraph: 'プライバシーポリシー',
  },
});
