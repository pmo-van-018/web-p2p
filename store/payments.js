/* eslint-disable no-console */
import PAYMENTS_API from '@/api/payments.js';
import MASTER_DATA_API from '@/api/master-data'
import { BANK } from '@/resources/bank';

export const state = () => ({
  payments: [],
  publicPayments: [],
  supportBanks: [],
  paymentDetail: {},
  selectedPayment: {},
  selectedPaymentId: 0,
  isPaymentLoading: true,
  reloadTrigger: 0,
  isShowSelectBank: true
})

export const mutations = {
  SET_PAYMENTS (state, payload) {
    state.payments = payload
  },
  SET_PUBLIC_PAYMENTS (state, payload) {
    state.publicPayments = payload
  },
  SET_SUPPORT_BANKS (state, payload) {
    state.supportBanks = payload
  },
  SET_PAYMENT_DETAIL (state, payload) {
    state.paymentDetail = payload
  },
  SET_SELECTED_PAYMENT (state, payload) {
    state.selectedPayment = payload
  },
  SET_PAYMENT_ID (state, payload) {
    state.selectedPaymentId = payload?.id
  },
  SET_PAYMENT_LOADING (state, payload) {
    state.isPaymentLoading = payload
  },
  SET_RELOAD_TRIGGER (state) {
    state.reloadTrigger = new Date().getTime()
  },
  SET_SHOW_SELECT_BANK (state, payload) {
    state.isShowSelectBank = payload
  }
}
export const getters = {
  getSupportedBanks: (state) => {
    return state.supportBanks.map((bankName) => {
      const bankSupported = BANK.find(bank => bank.bankName === bankName)
      if (bankSupported) {
        return bankSupported
      }
      return null
    }).filter(bank => bank)
  }
}

export const actions = {
  setPaymentDetail ({ commit }, payload) {
    commit('SET_PAYMENT_DETAIL', payload)
  },
  setSelectedPayment ({ commit }, payload) {
    commit('SET_SELECTED_PAYMENT', payload)
  },
  setPaymentId ({ commit }, payload) {
    commit('SET_PAYMENT_ID', payload)
  },
  setReloadTrigger ({ commit }) {
    commit('SET_RELOAD_TRIGGER')
  },
  setPublicPayments ({ commit }, payload) {
    commit('SET_PUBLIC_PAYMENTS', payload)
  },
  async getSupportBanks ({ commit }) {
    try {
      const res = await this.$axios.$get(MASTER_DATA_API.SUPPORT_BANKS)
      if (res?.data) {
        commit('SET_SUPPORT_BANKS', res.data?.supportedBanks || [])
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
    }
  },
  async getListPayment ({ commit }) {
    try {
      commit('SET_PAYMENT_LOADING', true)
      const res = await this.$axios.$get(PAYMENTS_API.LIST)
      if (res?.data) {
        commit('SET_PAYMENTS', res.data.items)
      }
      commit('SET_PAYMENT_LOADING', false)
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      commit('SET_PAYMENT_LOADING', false)
    }
  },
  async createPayment ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$post(PAYMENTS_API.CREATE, payload)
      if (res?.data?.id) {
        dispatch('getListPayment')
        dispatch('setReloadTrigger')
      }
      return res;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      throw error
    }
  },
  async updatePayment ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$put(PAYMENTS_API.UPDATE, payload)
      if (!res?.errors || res?.errors.length) {
        dispatch('getListPayment')
        dispatch('setReloadTrigger')
      }
      return res;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      throw error
    }
  },
  async deletePayment ({ commit, dispatch }, id) {
    try {
      const res = await this.$axios.$delete(PAYMENTS_API.DELETE(id))
      if (!res?.errors || res?.errors.length) {
        dispatch('getListPayment')
        dispatch('setReloadTrigger')
      }
      return res;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      throw error
    }
  },

  async getPaymentMethodAvailability ({ commit, dispatch }, id) {
    try {
      const response = await this.$axios.$get(PAYMENTS_API.GET_AVAILABILITY(id))
      return response?.data;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      throw error
    }
  },

  // user
  async getUserSupportBanks ({ commit }) {
    try {
      const res = await this.$axios.$get(MASTER_DATA_API.SUPPORT_BANKS)
      if (res?.data) {
        commit('SET_SUPPORT_BANKS', res.data?.supportedBanks || [])
      }
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
    }
  },
  async getUserListPayment ({ commit }) {
    try {
      commit('SET_PAYMENT_LOADING', true)
      const res = await this.$axios.$get(PAYMENTS_API.USER_LIST)
      if (res?.data) {
        commit('SET_PAYMENTS', res.data.items)
      }
      commit('SET_PAYMENT_LOADING', false)
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      commit('SET_PAYMENT_LOADING', false)
    }
  },
  async createUserPayment ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$post(PAYMENTS_API.USER_CREATE, payload)
      if (res?.data?.id) {
        dispatch('getUserListPayment')
        dispatch('setReloadTrigger')
      }
      return res;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      throw error
    }
  },
  async updateUserPayment ({ commit, dispatch }, payload) {
    try {
      const res = await this.$axios.$put(PAYMENTS_API.USER_UPDATE, payload)
      if (!res?.errors || res?.errors.length) {
        dispatch('getUserListPayment')
        dispatch('setReloadTrigger')
      }
      return res;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      throw error
    }
  },
  async deleteUserPayment ({ commit, dispatch }, id) {
    try {
      const res = await this.$axios.$delete(PAYMENTS_API.USER_DELETE(id))
      if (!res?.errors || res?.errors.length) {
        dispatch('getUserListPayment')
        dispatch('setReloadTrigger')
      }
      return res;
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      throw error
    }
  },
  setShowSelectBank ({ commit }, payload) {
    commit('SET_SHOW_SELECT_BANK', payload)
  }
};
