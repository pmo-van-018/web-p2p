import { GET_SUPPORTER_PROCESSING } from '@/api/staff';

export const state = () => ({
  totalPendingOrder: 0,
  orderDetail: {},
  supporters: [],
  isPaymentFromAnotherAccount: false
})

export const mutations = {
  SET_ORDER_DETAIL (state, payload) {
    state.orderDetail = payload
  },
  SET_TOTAL_PENDING_ORDER (state, payload) {
    state.totalPendingOrder = payload
  },
  SET_SUPPORTER_PROCESS_ORDER (state, payload) {
    state.supporters = payload
  },
  SET_CONFIRMED_PAYMENT_ANOTHER_ACCOUNT (state, payload) {
    state.isPaymentFromAnotherAccount = payload
  }
}
export const actions = {
  updateOrderDetail ({ commit }, payload) {
    commit('SET_ORDER_DETAIL', payload)
  },
  setPaymentFromAnotherAccount ({ commit }, payload) {
    commit('SET_CONFIRMED_PAYMENT_ANOTHER_ACCOUNT', payload)
  },
  async getSupporterProcess ({ commit }) {
    try {
      const res = await this.$axios.$get(GET_SUPPORTER_PROCESSING);
      if (res?.data?.items) {
        commit('SET_SUPPORTER_PROCESS_ORDER', res?.data?.items)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}
