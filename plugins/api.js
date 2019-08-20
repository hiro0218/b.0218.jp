import axios from 'axios';
import constant from '~/constant';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

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
    getArchive() {
      return axios({
        method: 'GET',
        baseURL: IS_PRODUCTION ? constant.SITE_URL : constant.DEV_SITE_URL,
        url: '/api/archive.json',
      });
    },
    getCategoryList() {
      return axios({
        method: 'GET',
        baseURL: IS_PRODUCTION ? constant.SITE_URL : constant.DEV_SITE_URL,
        url: '/api/categories.json',
      });
    },
  };

  inject('api', api);
};
