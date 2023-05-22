import { getPostsListJson, getTagsWithCount } from '@/lib/posts';
type PostListProps = UnpackedArray<ReturnType<typeof getPostsListJson>>;

const POST_DISPLAY_LIMIT = 5;

const pickPosts = ({ title, slug, date, updated, excerpt, tags }: PostListProps): PostListProps => {
  return { title, slug, date, updated, excerpt, tags };
};

export const getData = () => {
  const posts = getPostsListJson();
  const recentPosts = posts.slice(0, POST_DISPLAY_LIMIT).map((post) => pickPosts(post));
  const updatesPosts = posts
    .sort((a, b) => {
      return a.updated < b.updated ? 1 : -1;
    })
    .filter((post) => post.updated && post.date < post.updated)
    .filter((post) => {
      // recentPosts に含まれているものは除外する
      return !recentPosts.filter((recentPost) => post.slug === recentPost.slug).length;
    })
    .slice(0, POST_DISPLAY_LIMIT)
    .map((post) => pickPosts(post));

  const tags = getTagsWithCount()
    .filter((item, i) => item[1] >= 10 && i < 25) // 件数が10件以上を25個抽出
    .map(([slug, count]) => {
      return { slug, count };
    });

  return {
    recentPosts,
    updatesPosts,
    tags,
  };
};
