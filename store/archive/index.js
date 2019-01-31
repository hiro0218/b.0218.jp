export const state = () => ({
  data: {},
});

export const mutations = {
  setData(state, payload) {
    state.data = payload;
  },
};

export const getters = {
  dataSize: state => {
    return Object.keys(state.data).length;
  },
};

export const actions = {
  setData({ commit }, data) {
    commit('setData', data);
  },
};
