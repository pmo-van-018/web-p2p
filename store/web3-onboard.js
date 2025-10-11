export const state = () => ({
  web3Onboard: null,
  isVisibleWeb3Onboard: false
});

export const mutations = {
  SET_WEB3_ONBOARD (state, payload) {
    state.web3Onboard = payload;
  },
  SET_VISIBLE_WEB3_ONBOARD (state, payload) {
    state.isVisibleWeb3Onboard = payload;
  }
};

export const actions = {
  setWeb3Onboard ({ commit }, payload) {
    commit('SET_WEB3_ONBOARD', payload)
  },
  setVisibleWeb3Onboard ({ commit }, payload) {
    commit('SET_VISIBLE_WEB3_ONBOARD', payload)
  }
};
