import { DASHBOARD_API } from '@/api/dashboard';
import dayjs from 'dayjs';

export const state = () => ({
  merchantId: '',
  merchantInfo: {
    merchantName: '',
    merchantStatus: '',
    transInMonth: {},
    transTotal: {},
    completeRate: ''
  },
  isLoading: false
});

export const mutations = {
  SET_MERCHANT_ID (state, payload) {
    state.merchantId = payload
  },
  SET_MERCHANT_INFO (state, payload) {
    state.merchantInfo = payload
  },
  SET_IS_LOADING (state, payload) {
    state.isLoading = payload
  }
}

export const actions = {
  async getMerchantInfo ({ commit }, merchantId) {
    commit('SET_MERCHANT_ID', merchantId)
    try {
      commit('SET_IS_LOADING', true)
      const res = await this.$axios.$get(DASHBOARD_API.GET_OPERATION_BY_USER(merchantId));
      if (res?.data) {
        const merchantInfo = {}
        const result = res.data;
        merchantInfo.completeRate = result.recentCompleteRate
        merchantInfo.merchantName = result.nickName
        merchantInfo.merchantStatus = result.status
        merchantInfo.totalAmount = result.totalAmount
        merchantInfo.totalRecentAmount = result.totalRecentAmount
        merchantInfo.avatar = result.avatar
        merchantInfo.numRegistedDay = dayjs().diff(dayjs(result.createdAt), 'days') || 0
        merchantInfo.transTotal = {
          total: result.totalBuyOrder + result.totalSellOrder,
          buy: result.totalBuyOrder,
          sell: result.totalSellOrder
        }
        merchantInfo.transInMonth = {
          total: result.totalRecentSellOrder + result.totalRecentBuyOrder,
          buy: result.totalRecentBuyOrder,
          sell: result.totalRecentSellOrder
        }
        commit('SET_MERCHANT_INFO', merchantInfo)
      }
      commit('SET_IS_LOADING', false)
    } catch (error) {
      commit('SET_IS_LOADING', false)
      throw error
    }
  }
}
