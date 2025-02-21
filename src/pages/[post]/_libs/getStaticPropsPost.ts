import type { GetStaticProps } from 'next';

import type { Props as PostTagProps } from '@/components/UI/Tag';
import { getPostsJson, getTagsWithCount } from '@/lib/posts';
import { UPDATED_POST_DISPLAY_LIMIT } from '@/pages/_libs/constant';
import { getRecentAndUpdatedPosts } from '@/pages/_libs/getRecentAndUpdatedPosts';
import { getTagPosts } from '@/pages/_libs/getTagPosts';
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

  // 関連タグ
  const tag = post.tags[0];
  const similarTags = getSimilarTag(tag);

  // 関連記事
  let similarPost: ReturnType<typeof getSimilarPost | typeof getTagPosts> = getSimilarPost(posts, slug);
  // 関連記事がない場合は同一タグから記事を取得
  if (similarPost.length === 0 && !!tag) {
    similarPost = getTagPosts(tag)
      .filter((tagPost) => tagPost.slug !== slug)
      .slice(0, UPDATED_POST_DISPLAY_LIMIT);
  }

  return {
    props: {
      post: { ...post, tagsWithCount },
      similarPost,
      similarTags,
      recentPosts,
    },
  };
};
