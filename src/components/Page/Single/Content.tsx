import { notFound } from 'next/navigation';
import { parser } from '@/components/Page/_shared/parser/HTMLParser';
import { Stack } from '@/components/UI/Layout/Stack';
import { Title } from '@/components/UI/Title';
import { getPagesJson } from '@/lib/source/page';

type Props = {
  title: string;
  description: string;
  slug: 'about' | 'privacy';
};

const pages = getPagesJson();

export function Content({ title, description, slug }: Props) {
  const page = pages.find((page) => slug === page.slug);

  if (!page) {
    notFound();
  }

  const { content } = page;
  const reactContent = parser(content);

  return (
    <Stack gap={4}>
      <Title paragraph={description}>{title}</Title>
      <article className="post-content">{reactContent}</article>
    </Stack>
  );
}
