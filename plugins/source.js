import posts from '~/_source/posts.json';
import archives from '~/_source/archives.json';
import categories from '~/_source/categories.json';
import categories_posts from '~/_source/categories_posts.json';
import tags_posts from '~/_source/tags_posts.json';

export default (context, inject) => {
  const source = {
    posts,
    archives,
    categories,
    categories_posts,
    tags_posts,
  };

  inject('source', source);
};
