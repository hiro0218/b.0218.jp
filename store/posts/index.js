export const state = () => ({
  headers: {},
  list: [],
  categoryList: [],
});

export const mutations = {
  setHeaders(state, payload) {
    state.headers = {
      total: Number(payload['x-wp-total']),
      totalpages: Number(payload['x-wp-totalpages']),
    };
  },
  setList(state, payload) {
    state.list = payload;
  },
  setCategoryList(state, payload) {
    state.categoryList = payload;
  },
};

export const getters = {
  categoryListSize: state => {
    return state.categoryList.length;
  },
};

export const actions = {
  setHeaders({ commit }, data) {
    commit('setHeaders', data);
  },
  resetList({ commit }) {
    commit('setList', []);
  },
  setList({ commit }, data) {
    commit('setList', data);
  },
  async fetch({ dispatch }, { page, search, archiveParams }) {
    return await this.$api
      .getPosts({
        params: {
          page,
          search,
          ...archiveParams,
        },
      })
      .then(res => {
        dispatch('setHeaders', res.headers);
        dispatch('setList', res.data);
      });
  },
};
