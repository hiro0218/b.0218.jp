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
    commit('setData', {});
  },
  setData({ commit }, data) {
    commit('setData', data);
  },
};
