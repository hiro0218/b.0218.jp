import type { GetStaticProps } from 'next';

import type { Props as PostTagProps } from '@/components/UI/Tag';
import { getPostsJson, getTagsWithCount } from '@/lib/posts';
import { getRecentAndUpdatedPosts } from '@/pages/_libs/getRecentAndUpdatedPosts';
import type { PostListProps, PostProps, TermsPostListProps } from '@/types/source';

import { getSimilarPost } from './getSimilarPost';
import { getSimilarTag } from './getSimilarTag';

export type PostPageProps = {
  post: PostProps & {
    tagsWithCount: PostTagProps[];
  };
  similarPost: TermsPostListProps[];
  similarTags: PostTagProps[];
  recentPosts: PostListProps[];
};

const posts = getPostsJson();
const tagDataWithCount = getTagsWithCount();
const tagDataWithCountBySlug = Object.fromEntries(tagDataWithCount.map((tag) => [tag.slug, tag]));
// 最新記事
const { recentPosts } = getRecentAndUpdatedPosts({
  posts: Array.from(posts.values()),
});

export const getStaticPropsPost: GetStaticProps<PostPageProps> = (context) => {
  const slug = (context.params?.post as string).replace('.html', '');

  // slug に一致する post を取得
  const post = posts.get(slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  // tagsに件数を追加
  const tagsWithCount = post.tags.map((slug) => tagDataWithCountBySlug[slug]).filter((tag) => tag !== undefined);

  // 関連記事
  const similarPost = getSimilarPost(posts, slug);

  // 関連タグ
  const tag = post.tags[0];
  const similarTags = getSimilarTag(tag);

  return {
    props: {
      post: { ...post, tagsWithCount },
      similarPost,
      similarTags,
      recentPosts,
    },
  };
};
