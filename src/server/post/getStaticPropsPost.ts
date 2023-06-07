import type { GetStaticProps } from 'next';

import type { Props as PostTagProps } from '@/components/UI/Tag';
import { getPostsJson, getTagsJson } from '@/lib/posts';
import type { PostProps, TermsPostListProps } from '@/types/source';

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

const posts = getPostsJson();
const tagData = getTagsJson();

const postsBySlug = Object.fromEntries(posts.map((post) => [post.slug, post]));
const tagDataWithCount = Object.entries(tagData).map(([slug, val]) => ({
  slug,
  count: val.length,
}));
const tagDataWithCountBySlug = Object.fromEntries(tagDataWithCount.map((tag) => [tag.slug, tag]));

export const getStaticPropsPost: GetStaticProps<PostPageProps> = (context) => {
  const slug = (context.params?.post as string).replace('.html', '');

  // slug に一致する post を取得
  const post = postsBySlug[slug];

  if (!post) {
    return {
      notFound: true,
    };
  }

  // tagsに件数を追加
  const tagsWithCount = post.tags.map((slug) => tagDataWithCountBySlug[slug]).filter((tag) => tag !== undefined);

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
