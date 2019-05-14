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
    await this.$api
      .getPosts({
        params: {
          page,
          search,
          ...archiveParams,
        },
      })
      .then(res => {
        dispatch('posts/setHeaders', res.headers, { root: true });
        dispatch('posts/setList', res.data, { root: true });
      });
  },
  async fetchCategoryList({ commit, getters }) {
    if (getters.categoryListSize !== 0) return;

    await this.$api.getCategoryList().then(res => {
      commit('posts/setCategoryList', res.data, { root: true });
    });
  },
};
