import { MERCHANT_API } from '@/api/merchant';

export const state = () => ({
  statistics: {},
  cancelOrderAppeal: 0
})

export const mutations = {
  SET_STATISTICS (state, payload) {
    state.statistics = payload
  },
  SET_CANCEL_ORDER_APPEAL (state, payload) {
    if (payload.cancelOrderAppeal) {
      state.cancelOrderAppeal++
    }
  },
  RESET_CANCEL_ORDER_APPEAL (state) {
    state.cancelOrderAppeal = 0
  }
}
export const actions = {
  async getMerchantStatistic ({ commit }) {
    try {
      const { data } = await this.$axios.$get(MERCHANT_API.STATISTIC)
      commit('SET_STATISTICS', data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
  setStatistic ({ commit }, payload) {
    commit('SET_STATISTICS', payload)
    commit('SET_CANCEL_ORDER_APPEAL', payload)
  },
  resetCancelOrderAppeal ({ commit }) {
    commit('RESET_CANCEL_ORDER_APPEAL')
  }
}
