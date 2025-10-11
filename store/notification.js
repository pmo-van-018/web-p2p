export const state = () => ({
  items: [],
  totalItem: 0,
  totalBell: 0,
  totalSystem: 0,
  totalTransaction: 0,
  totalPages: 0
});

export const mutations = {
  SET_TOTAL_NOTIFICATION (state, payload) {
    state.totalItem = payload
  },
  SET_NOTIFICATION (state, payload) {
    state.items = payload
  },
  SET_TOTAL_BELL (state, payload) {
    state.totalBell = payload
  },
  SET_TOTAL_SYSTEM (state, payload) {
    state.totalSystem = payload
  },
  SET_TOTAL_TRANSACTION (state, payload) {
    state.totalTransaction = payload
  },
  SET_TOTAL_PAGES (state, payload) {
    state.totalPages = payload
  }
}

export const actions = {
  setTotalNotification ({ commit }, payload) {
    commit('SET_TOTAL_NOTIFICATION', payload)
  },
  setNotification ({ commit }, payload) {
    commit('SET_NOTIFICATION', payload)
  },
  setTotalBell ({ commit }, payload) {
    commit('SET_TOTAL_BELL', payload)
  },
  setTotalSystem ({ commit }, payload) {
    commit('SET_TOTAL_SYSTEM', payload)
  },
  setTotalTransaction ({ commit }, payload) {
    commit('SET_TOTAL_TRANSACTION', payload)
  },
  setTotalPages ({ commit }, payload) {
    commit('SET_TOTAL_PAGES', payload)
  }
};
