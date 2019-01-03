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
};
