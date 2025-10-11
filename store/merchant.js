import MERCHANT_ORDER_API from '@/api/merchant-order'

export const state = () => ({
  buyInfoDetail: {
    amount: 0,
    totalPrice: 0
  },
  totalPendingOrder: 0,
  isLoading: false
})

export const mutations = {
  SET_BUY_INFO_DETAIL (state, payload) {
    state.buyInfoDetail = payload
  },
  SET_IS_LOADING (state, payload) {
    state.isLoading = payload
  }
}

export const actions = {
  async getBuyInfoDetail ({ commit }, orderId) {
    try {
      commit('SET_IS_LOADING', true)
      const res = await this.$axios.$get(MERCHANT_ORDER_API.BUY_INFO(orderId))
      if (res?.data) {
        commit('SET_BUY_INFO_DETAIL', res.data)
      }
      commit('SET_IS_LOADING', false)
    } catch (error) {
      commit('SET_IS_LOADING', false)
    }
  }
}
