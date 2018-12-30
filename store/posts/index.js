export const state = () => ({
  headers: {},
  list: [],
});

export const mutations = {
  setHeaders(state, payload) {
    state.headers = payload;
  },
  setList(state, payload) {
    state.list = payload;
  },
};

export const actions = {
  setHeaders({ commit }, data) {
    commit('setHeaders', data);
  },
  setList({ commit }, data) {
    commit('setList', data);
  },
};
