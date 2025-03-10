import type { GetStaticProps } from 'next';

import type { Props as PostTagProps } from '@/components/UI/Tag';
import { getPostsJson, getTagsWithCount } from '@/lib/posts';
import { UPDATED_POST_DISPLAY_LIMIT } from '@/pages/_libs/constant';
import { getDateAndUpdatedToSimpleFormat } from '@/pages/_libs/getDateAndUpdatedToSimpleFormat';
import { getRecentAndUpdatedPosts } from '@/pages/_libs/getRecentAndUpdatedPosts';
import { getTagPosts } from '@/pages/_libs/getTagPosts';
import type { PostListProps, PostProps, TermsPostListProps } from '@/types/source';
import { getSimilarPost } from './getSimilarPost';
import { getSimilarTag } from './getSimilarTag';

type PostPageProps = {
  post: PostProps & {
    tagsWithCount: PostTagProps[];
    meta: {
      publishedTime: string;
      modifiedTime?: string;
    };
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
  posts,
});

export const getStaticPropsPost: GetStaticProps<PostPageProps> = (context) => {
  const slug = (context.params?.post as string).replace('.html', '');

  // slug に一致する post を取得
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  // tagsに件数を追加
  const tagsWithCount: PostTagProps[] = post.tags
    .map((slug) => tagDataWithCountBySlug[slug])
    .filter((tag) => tag !== undefined);

  // 関連タグ
  const tag = post.tags[0];
  const similarTags: PostTagProps[] = getSimilarTag(tag);

  // 関連記事
  let similarPost: TermsPostListProps[] = getSimilarPost(posts, slug);
  // 関連記事がない場合は同一タグから記事を取得
  if (similarPost.length === 0 && !!tag) {
    similarPost = getTagPosts(tag)
      .filter((tagPost) => tagPost.slug !== slug)
      .slice(0, UPDATED_POST_DISPLAY_LIMIT);
  }

  return {
    props: {
      post: {
        ...post,
        ...getDateAndUpdatedToSimpleFormat(post.date, post.updated),
        tagsWithCount,
        meta: {
          publishedTime: post.date,
          ...(post.updated && { modifiedTime: post.updated }),
        },
      },
      similarPost,
      similarTags,
      recentPosts,
    },
  };
};
