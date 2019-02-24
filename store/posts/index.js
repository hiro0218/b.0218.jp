export const state = () => ({
  headers: {},
  list: [],
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
    await this.$axios
      .get('wp/v2/posts', {
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
};
