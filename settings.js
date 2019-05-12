import axios from 'axios';
import constant from './constant';

export const route = {
  async getData() {
    return await axios
      .get(`${constant.ENDPOINT}wp/v2/posts`, {
        params: {
          _fields: 'id,slug',
          per_page: 1000,
        },
      })
      .then(res => res.data);
  },
};
