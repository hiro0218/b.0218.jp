import { getSimilarPost } from '@/app/(PostPage)/[slug]/lib/getSimilarPost';
import { getSimilarTag } from '@/app/(PostPage)/[slug]/lib/getSimilarTag';
import { UPDATED_POST_DISPLAY_LIMIT } from '@/app/libs/constant';
import { getDateAndUpdatedToSimpleFormat } from '@/app/libs/getDateAndUpdatedToSimpleFormat';
import { getRecentAndUpdatedPosts } from '@/app/libs/getRecentAndUpdatedPosts';
import { getTagPosts } from '@/app/libs/getTagPosts';
import type { Props as PostTagProps } from '@/components/UI/Tag';
import { getPostsJson, getTagsWithCount } from '@/lib/posts';
import type { TermsPostListProps } from '@/types/source';

const posts = getPostsJson();
const tagDataWithCount = getTagsWithCount();
const tagDataWithCountBySlug = Object.fromEntries(tagDataWithCount.map((tag) => [tag.slug, tag]));

export const getData = (slug: string) => {
  const post = posts.find((post) => post.slug === slug.replace('.html', ''));

  if (!post) {
    return null;
  }

  const { recentPosts } = getRecentAndUpdatedPosts({
    posts,
  });

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
  };
};
