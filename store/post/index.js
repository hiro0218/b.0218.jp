import copy from 'fast-copy';

const dummyData = {
  id: 0,
  date: '',
  modified: '',
  slug: '',
  link: '',
  title: { rendered: '' },
  content: {
    rendered: '',
  },
  excerpt: {
    rendered: '',
  },
  amazon_product: null,
  thumbnail: '',
  attach: {
    related: [],
    pager: {},
    custom: {},
  },
  _links: {},
  _embedded: {
    'wp:term': [],
  },
};

export const state = () => ({
  data: {},
});

export const mutations = {
  setData(state, payload) {
    state.data = payload;
  },
};

export const actions = {
  restData({ commit }) {
    commit('setData', copy(dummyData));
  },
  setData({ commit }, data) {
    commit('setData', data);
  },
};
