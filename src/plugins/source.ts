import { Plugin } from '@nuxt/types';

import archives from '~/_source/archives.json';
import categories from '~/_source/categories.json';
import categoriesPosts from '~/_source/categories_posts.json';
import pages from '~/_source/pages.json';
import posts from '~/_source/posts.json';
import tagsPosts from '~/_source/tags_posts.json';

const source: Plugin = (context) => {
  context.$source = {
    pages,
    posts,
    archives,
    categories,
    categoriesPosts,
    tagsPosts,
  };
};

export default source;
