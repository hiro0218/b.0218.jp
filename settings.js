import axios from 'axios';
import constant from './constant';

export const route = {
  async getData() {
    const posts = await axios
      .get(`${constant.ENDPOINT}wp/v2/posts`, {
        params: {
          _fields: 'id,slug',
          per_page: 1000,
        },
      })
      .then(res => {
        let routes = [];

        res.data.map(post => {
          routes.push(post.slug.replace('.html', ''));
        });

        return routes;
      });

    const categories = await axios
      .get(`${constant.ENDPOINT}wp/v2/categories`, {
        params: {
          _fields: 'id,slug',
          order: 'desc',
          orderby: 'count',
        },
      })
      .then(res => {
        let routes = [];

        res.data.map(post => {
          routes.push(`categories/${post.slug}`);
        });

        return routes;
      });

    const tags = await axios
      .get(`${constant.ENDPOINT}wp/v2/tags`, {
        params: {
          _fields: 'id,slug',
          order: 'desc',
          orderby: 'count',
        },
      })
      .then(res => {
        let routes = [];

        res.data.map(post => {
          routes.push(`tags/${post.slug}`);
        });

        return routes;
      });

    return posts.concat(categories, tags);
  },
};
