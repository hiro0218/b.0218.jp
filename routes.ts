import fs from 'fs-extra';
const SRC_DIR = './src/_source';

export const getRoutes = () => {
  const routes = [];

  // 記事一覧
  /// archives.json
  const posts = fs.readJsonSync(`${SRC_DIR}/archives.json`);
  posts.forEach((post) => {
    routes.push(post.path.replace('.html', ''));
  });

  // カテゴリ
  /// categories.json
  const categories = fs.readJsonSync(`${SRC_DIR}/categories.json`);
  categories.forEach((category) => {
    routes.push(`categories/${category.slug}`);
  });

  // タグ
  /// tags.json
  const tags = fs.readJsonSync(`${SRC_DIR}/tags.json`);
  tags.forEach((tag) => {
    routes.push(`tags/${tag.slug}`);
  });

  return routes;
};
