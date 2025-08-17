import { parser } from '@/components/Page/Post/Content';
import { Box } from '@/components/UI/Layout';
import { Title } from '@/components/UI/Title';
import { getPagesJson } from '@/lib/posts';

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
    <>
      <Title heading={title} paragraph={description} />
      <Box as="article" className={'post-content'} mt={4}>
        {reactContent}
      </Box>
    </>
  );
}
