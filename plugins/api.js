import axios from 'axios';
import constant from '~/constant';

export default (ctx, inject) => {
  // setting
  const client = axios.create({
    baseURL: constant.ENDPOINT,
  });

  // methods
  const api = {
    getPosts(params) {
      return client.get('wp/v2/posts', params);
    },
    getPost(params) {
      return client.get(`wp/v2/posts?slug=${params.post}`, {
        params: {
          _embed: '',
        },
      });
    },
    getCategories(params) {
      return client.get('wp/v2/categories', params);
    },
    getTags(params) {
      return client.get('wp/v2/tags', params);
    },
    getArchive() {
      if (process.static) {
        return client.get('0218/v1/archive');
      }

      return axios.get('/api/archive.json');
    },
    getCategoryList() {
      if (process.static) {
        return this.getCategories({
          params: {
            order: 'desc',
            orderby: 'count',
          },
        });
      }

      return axios.get('/api/categories.json');
    },
  };

  inject('api', api);
};
