/* eslint-disable no-console */
import { ADMIN_API } from '@/api/admin'

export const state = () => ({
  isLoading: false,
  detailAppeal: null,
  confirmModal: {
    title: '',
    key: '',
    postType: '',
    orderId: '',
    appealId: '',
    modalType: '',
    totalPrice: 0,
    amount: 0,
    requestAmount: 0,
    fiatSymbol: '',
    assetName: ''
  },
  extraModal: {
    title: '',
    postType: '',
    appealId: '',
    refId: ''
  },
  listAppeal: [],
  appealCount: 0
})

export const mutations = {
  SET_CONFIRM_MODAL (state, payload) {
    state.confirmModal = payload
  },
  SET_EXTRA_MODAL (state, payload) {
    state.extraModal = payload
  },
  SET_IS_LOADING (state, payload) {
    state.isLoading = payload
  },
  SET_DETAIL_APPEAL (state, payload) {
    state.detailAppeal = payload
  },
  SET_APPEAL_COUNT (state, payload) {
    state.appealCount = payload
  },
  ADD_APPEAL_COUNT (state) {
    state.appealCount += 1
  },
  SUB_APPEAL_COUNT (state) {
    if (state.appealCount > 0) {
      state.appealCount -= 1
    }
  }
}
export const getters = {

}

export const actions = {
  setConfirmModal ({ commit }, payload) {
    commit('SET_CONFIRM_MODAL', payload)
  },
  setExtraModal ({ commit }, payload) {
    commit('SET_EXTRA_MODAL', payload)
  },
  async onDecideSellResult ({ commit, dispatch }, { appealId, decisionResult }) {
    try {
      commit('SET_IS_LOADING', true)
      const res = await this.$axios.$post(ADMIN_API.DECIDE_SELL_RESULT, {
        appealId,
        decisionResult
      });
      dispatch('onShowDetailAppeal', appealId)
      commit('SET_IS_LOADING', false)
      return res;
    } catch (error) {
      commit('SET_IS_LOADING', false)
      throw error
    }
  },
  async onDecideBuyResult ({ commit, dispatch }, { appealId, decisionResult, amount }) {
    try {
      commit('SET_IS_LOADING', true)
      const res = await this.$axios.$post(ADMIN_API.DECIDE_BUY_RESULT, {
        appealId,
        decisionResult,
        ...(Number(amount) !== 0 && { amount: Number(amount) })
      });
      dispatch('onShowDetailAppeal', appealId)
      commit('SET_IS_LOADING', false)
      return res;
    } catch (error) {
      commit('SET_IS_LOADING', false)
      throw error
    }
  },
  async onShowDetailAppeal ({ commit, dispatch }, appealId) {
    try {
      const res = await this.$axios.$get(`${ADMIN_API.APPEAL_DETAIL}/${appealId}`);
      if (res?.errors?.length) {
        return res
      }
      commit('SET_DETAIL_APPEAL', res.data)
    } catch (error) {
      const errorKey = error.response?.data?.errors[0]?.key
      if ([
        'ADMIN_SUPPORTER_VIEW_APPEAL_PERMISSION_DENIED'
      ].includes(errorKey)) {
        await this.$router.replace('/admin-supporter/list-appeals')
      }
    }
  },
  async onExtraTimeAppeal ({ commit, dispatch }, { appealId, evidentTimeoutAt }) {
    try {
      await this.$axios.$post(ADMIN_API.EXTRA_TIME, {
        appealId,
        evidentTimeoutAt
      });
      dispatch('onShowDetailAppeal', appealId)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async countOpeningAppeal ({ commit }) {
    try {
      const res = await this.$axios.$get(`${ADMIN_API.COUNT_OPENING_APPEAL}`);
      if (res?.data) {
        commit('SET_APPEAL_COUNT', res.data?.total)
      }
    } catch (error) {
      console.error(error)
    }
  },
  setWaitingAppealCount ({ commit }, payload) {
    commit('SET_APPEAL_COUNT', payload)
  },
  addWaitingAppealCount ({ commit }) {
    commit('ADD_APPEAL_COUNT')
  },
  subWaitingAppealCount ({ commit }) {
    commit('SUB_APPEAL_COUNT')
  }
};
