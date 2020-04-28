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
    getTerms(type, params) {
      if (type === 'categories') {
        return this.getCategories(params);
      }
      if (type === 'tags') {
        return this.getTags(params);
      }
    },
    getCategories(params) {
      return client.get('wp/v2/categories', params);
    },
    getTags(params) {
      return client.get('wp/v2/tags', params);
    },
  };

  inject('api', api);
};
