import axios from 'axios';
import constant from './constant';

export const route = {
  async getData(sitemap = false) {
    return await axios
      .all([
        axios.get(`${constant.ENDPOINT}0218/v1/sitemap`),
        axios.get(`${constant.ENDPOINT}wp/v2/tags`, {
          params: {
            _fields: 'id,slug',
            order: 'desc',
            orderby: 'count',
          },
        }),
        axios.get(`${constant.ENDPOINT}wp/v2/categories`, {
          params: {
            _fields: 'id,slug',
            order: 'desc',
            orderby: 'count',
          },
        }),
      ])
      .then(
        axios.spread(function(posts, tags, cats) {
          const routes = [];

          posts.data.map(post => {
            const slug = sitemap ? post.slug : post.slug.replace('.html', '');
            routes.push(slug);
          });

          tags.data.map(post => {
            routes.push(`tags/${post.slug}`);
          });

          cats.data.map(post => {
            routes.push(`categories/${post.slug}`);
          });

          return routes;
        }),
      );
  },
};
