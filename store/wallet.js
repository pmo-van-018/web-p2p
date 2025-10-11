export const state = () => ({
  resultConnectWallet: 'fail',
  openConnectWallet: false,
  showV99Qr: null
});

export const mutations = {
  SET_RESULT_CONNECT_WALLET (state, payload) {
    state.resultConnectWallet = payload;
  },
  SET_OPEN_CONNECT_WALLET (state, payload) {
    state.openConnectWallet = payload;
  },
  SET_OPEN_V99_QR (state, payload) {
    state.showV99Qr = payload;
  }
};

export const actions = {
  setResultConnectWallet ({ commit }, payload) {
    commit('SET_RESULT_CONNECT_WALLET', payload)
  },
  setOpenConnectWallet ({ commit }, payload) {
    commit('SET_OPEN_CONNECT_WALLET', payload)
  },
  setOpenV99QR ({ commit }, payload) {
    commit('SET_OPEN_V99_QR', payload)
  }
};
