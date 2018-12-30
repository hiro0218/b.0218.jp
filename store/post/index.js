export const state = () => ({
  headers: {},
  list: [],
});

export const mutations = {
  setHeaders(state, payload) {
    state.headers = payload;
  },
  setPostList(state, payload) {
    state.list = payload;
  },
};

export const actions = {
  setHeaders({ commit }, data) {
    commit('setHeaders', data);
  },
  setPostList({ commit }, data) {
    commit('setPostList', data);
  },
};
