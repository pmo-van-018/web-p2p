/* eslint-disable no-console */
import ADMIN_SUPPORTER_API from '@/api/admin-supporter';

export const state = () => ({
  isLoading: false,
  requestCount: 0,
  failedTransactionCount: 0
})

export const mutations = {
  SET_IS_LOADING (state, payload) {
    state.isLoading = payload
  },
  SET_SUPPORT_REQUEST_COUNT (state, payload) {
    state.requestCount = payload
  },
  SET_FAILED_TRANSACTION_COUNT (state, payload) {
    state.failedTransactionCount = payload
  },
  ADD_SUPPORT_REQUEST_COUNT (state, payload) {
    state.requestCount += 1
  },
  SUB_SUPPORT_REQUEST_COUNT (state, payload) {
    if (state.requestCount > 0) {
      state.requestCount -= 1
    }
  }
}
export const getters = {

}

export const actions = {
  setSupportRequestCount ({ commit }, payload) {
    commit('SET_SUPPORT_REQUEST_COUNT', payload)
  },
  async countWaitingRequest ({ commit, dispatch }) {
    try {
      const res = await this.$axios.$get(ADMIN_SUPPORTER_API.COUNT_PENDING_SUPPORT_REQUESTS)
      commit('SET_SUPPORT_REQUEST_COUNT', res.data?.total || 0)
    } catch (error) {
      console.error(error)
    }
  },
  addSupportRequestCount ({ commit, dispatch }) {
    commit('ADD_SUPPORT_REQUEST_COUNT')
  },
  subSupportRequestCount ({ commit, dispatch }) {
    commit('SUB_SUPPORT_REQUEST_COUNT')
  },
  async countFailedTransaction ({ commit, dispatch }) {
    try {
      const res = await this.$axios.$get(ADMIN_SUPPORTER_API.COUNT_FAILED_TRANSACTION)
      commit('SET_FAILED_TRANSACTION_COUNT', res.data?.total || 0)
    } catch (error) {
      console.error(error)
    }
  }
};
