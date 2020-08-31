import pages from '../_source/pages.json';
import posts from '../_source/posts.json';
import archives from '../_source/archives.json';
import categories from '../_source/categories.json';
import categoriesPosts from '../_source/categories_posts.json';
import tagsPosts from '../_source/tags_posts.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (context, inject) => {
  const source = {
    pages,
    posts,
    archives,
    categories,
    categoriesPosts,
    tagsPosts,
  };

  inject('source', source);
};
