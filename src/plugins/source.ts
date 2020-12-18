import { Plugin } from '@nuxt/types';

import archives from '~/_source/archives.json';
import categories from '~/_source/categories.json';
import categoriesPosts from '~/_source/categories_posts.json';
import pages from '~/_source/pages.json';
import posts from '~/_source/posts.json';
import recentPosts from '~/_source/recent_posts.json';
import tagsPosts from '~/_source/tags_posts.json';
import updatedPosts from '~/_source/updates_posts.json';

const source: Plugin = (context) => {
  context.$source = {
    pages,
    posts,
    recentPosts,
    archives,
    categories,
    categoriesPosts,
    tagsPosts,
    updatedPosts,
  };
};

export default source;
