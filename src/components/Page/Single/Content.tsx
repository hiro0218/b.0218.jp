import { parser } from '@/components/Page/Post/Content/parser/HTMLParser';
import { Stack } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { getPagesJson } from '@/lib/data/posts';

type Props = {
  title: string;
  description: string;
  slug: 'about' | 'privacy';
};

const pages = getPagesJson();

export default function Content({ title, description, slug }: Props) {
  const { content } = pages.find((page) => slug === page.slug);
  const reactContent = parser(content);

  return (
    <Stack gap={4}>
      <Title paragraph={description}>{title}</Title>
      <article className="post-content">{reactContent}</article>
    </Stack>
  );
}
