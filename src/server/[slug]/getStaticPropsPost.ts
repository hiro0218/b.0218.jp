import { GetStaticProps } from 'next';

import { Props as PostTagProps } from '@/components/UI/Tag';
import { TAG_VIEW_LIMIT } from '@/constant';
import { getPostsJson, getSimilarPost, getSimilarTag, getTagsJson } from '@/lib/posts';
import { textSegmenter } from '@/lib/textSegmenter';
import { Post as PostType, PostSimilar as PostSimilarProps, TermsPostList } from '@/types/source';

export type PostProps = {
  post: PostType & {
    tagsWithCount: PostTagProps[];
    segmentedTitle: string;
  };
  similarPost: TermsPostList[];
  similarTags: PostTagProps[];
};

const getSimilarPostBySlug = (similarPosts: PostSimilarProps, key: string) => {
  const result = similarPosts.find((slug) => slug.hasOwnProperty(key));
  return result ? result[key] : null;
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
  const similarPosts = getSimilarPost();
  const similarPostSlugs = getSimilarPostBySlug(similarPosts, slug);
  const similarPost = Object.keys(similarPostSlugs).map((slug) => {
    const { title, date, updated, excerpt } = posts.find((post) => post.slug === slug);

    return {
      title,
      slug,
      date,
      updated,
      excerpt,
    };
  });

  // 奇数の場合は偶数に寄せる
  if (similarPost.length % 2 !== 0) {
    similarPost.pop();
  }

  // 関連タグ
  const tag = post.tags[0];
  const getTagBySlug = (slug: PostTagProps['slug']) => {
    return Object.entries(tagData).find(([key]) => key === slug);
  };
  const similarTagsList = getSimilarTag()[tag];
  const similarTags: PostTagProps[] = !!similarTagsList
    ? Object.entries(similarTagsList)
        .map(([slug]) => {
          const tag = getTagBySlug(slug);
          const count = tag.length > 1 ? tag[1].length : 0;
          return count >= TAG_VIEW_LIMIT ? { slug, count } : null;
        })
        .filter((item) => item !== null)
        .sort((a, b) => b.count - a.count)
    : [];

  return {
    props: {
      post: { ...post, tagsWithCount, segmentedTitle },
      similarPost,
      similarTags,
    },
  };
};
