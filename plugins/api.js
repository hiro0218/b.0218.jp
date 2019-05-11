import axios from 'axios';
import { constant } from '~/settings';

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
      return client.get('0218/v1/archive');
    },
  };

  inject('api', api);
};
