import { PostContent } from '@/components/Functional/CssIndividual/Pages/Post';
import { createGetLayout } from '@/components/Layouts/SinglePageLayout';
import { SITE_NAME } from '@/constant';
import { getPagesJson } from '@/lib/posts';

const pages = getPagesJson();
const { content } = pages.find((page) => page.slug === 'privacy');

export default function Privacy() {
  return (
    <PostContent
      dangerouslySetInnerHTML={{
        __html: content,
      }}
    />
  );
}

Privacy.getLayout = createGetLayout({
  head: { title: `プライバシーポリシー - ${SITE_NAME}` },
  title: {
    heading: 'Privacy',
    paragraph: 'プライバシーポリシー',
  },
});
