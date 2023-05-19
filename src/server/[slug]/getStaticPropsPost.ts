import { GetStaticProps } from 'next';

import { Props as PostTagProps } from '@/components/UI/Tag';
import { getPostsJson, getTagsJson } from '@/lib/posts';
import { PostProps, TermsPostListProps } from '@/types/source';

import { getSimilarPost } from './getSimilarPost';
import { getSimilarTag } from './getSimilarTag';
import { textSegmenter } from './textSegmenter';

export type PostPageProps = {
  post: PostProps & {
    tagsWithCount: PostTagProps[];
    segmentedTitle: string;
  };
  similarPost: TermsPostListProps[];
  similarTags: PostTagProps[];
};

export const getStaticPropsPost: GetStaticProps<PostPageProps> = (context) => {
  const posts = getPostsJson();
  const tagData = getTagsJson();
  const tagDataWithCount = Object.entries(tagData)
    .map(([slug, val]) => {
      return { slug, count: val.length };
    })
    .sort((a, b) => b.count - a.count);
  const slug = (context.params?.slug as string).replace('.html', '');

  // slug に一致する post を取得
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  // tagsに件数を追加
  const tagsWithCount = post.tags
    .map((slug) => {
      return tagDataWithCount.find((tag) => tag.slug === slug) || null;
    })
    .filter((tag) => tag !== null) as PostTagProps[];

  // タイトルの文字組み
  const segmentedTitle = textSegmenter(post.title);

  // 関連記事
  const similarPost = getSimilarPost(posts, slug);

  // 関連タグ
  const tag = post.tags[0];
  const similarTags = getSimilarTag(tag, tagData);

  return {
    props: {
      post: { ...post, tagsWithCount, segmentedTitle },
      similarPost,
      similarTags,
    },
  };
};
