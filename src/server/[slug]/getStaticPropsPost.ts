import { GetStaticProps } from 'next';

import { Props as PostTagProps } from '@/components/UI/Tag';
import { getPostsJson, getTagsJson } from '@/lib/posts';
import { Post as PostType, TermsPostList } from '@/types/source';

import { getSimilarPost } from './getSimilarPost';
import { getSimilarTag } from './getSimilarTag';
import { textSegmenter } from './textSegmenter';

export type PostProps = {
  post: PostType & {
    tagsWithCount: PostTagProps[];
    segmentedTitle: string;
  };
  similarPost: TermsPostList[];
  similarTags: PostTagProps[];
};

export const getStaticPropsPost: GetStaticProps<PostProps> = (context) => {
  const posts = getPostsJson();
  const tagData = getTagsJson();
  const tagDataWithCount = Object.entries(tagData)
    .map(([slug, val]) => {
      return { slug, count: val.length };
    })
    .sort((a, b) => b.count - a.count);
  const slug = (context.params.slug as string).replace('.html', '');

  // slug に一致する post を取得
  const post = posts.find((post) => post.slug === slug);

  // tagsに件数を追加
  const tagsWithCount: PostTagProps[] = post.tags.map((slug) => {
    return tagDataWithCount.find((tag) => tag.slug === slug) || null;
  });

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
