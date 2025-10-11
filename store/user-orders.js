import ORDER_API from '@/api/user-order'
import { STATUS_PENDING_ORDER } from '@/resources/merchant/orders-filter.js';
import { ORDER_STATUS } from '@/config/constant'

const getDefaultState = () => {
  return {
    listOrder: [],
    page: 1,
    type: '',
    limit: 10,
    total: 0,
    amount: 0,
    assetType: 0,
    search: '',
    endDate: '',
    startDate: '',
    orderField: 'updatedAt',
    orderLoading: false,
    orderStatus: '1,2,3',
    totalPendingOrder: 0,
    orderDirection: 'ASC'
  }
}

export const state = () => {
  return getDefaultState()
}

export const getters = {
  params: (state) => {
    const filter = {}
    state.page && (filter.page = state.page)
    state.type && (filter.type = state.type)
    state.limit && (filter.limit = state.limit)
    state.search && (filter.search = state.search)
    state.amount && (filter.amount = state.amount)
    state.endDate && (filter.endDate = state.endDate)
    state.startDate && (filter.startDate = state.startDate)
    state.assetType && (filter.assetType = state.assetType)
    state.orderField && (filter.orderField = state.orderField)
    state.orderStatus && (filter.status = state.orderStatus)
    state.orderDirection && (filter.orderDirection = state.orderDirection)
    return filter
  }
}

export const mutations = {
  SET_LIST_ORDERS (state, payload) {
    state.listOrder = payload
  },
  SET_FILTER (state, { key, value }) {
    state[key] = value
  },
  SET_ORDER_LOADING (state, payload) {
    state.orderLoading = payload
  },
  SET_TOTAL (state, payload) {
    state.total = payload
  },
  SET_TOTAL_PENDING_ORDER (state, payload) {
    state.totalPendingOrder = payload
  },
  RESET_FILTER (state) {
    const { totalPendingOrder, ...defaultState } = getDefaultState()
    Object.assign(state, defaultState)
  }
}

export const actions = {
  updateOrderList ({ commit }, payload) {
    commit('SET_LIST_ORDERS', payload)
  },
  updateMultiFilter ({ commit, dispatch }, payload) {
    for (const [key, value] of Object.entries(payload)) {
      commit('SET_FILTER', { key, value })
    }
  },
  resetStateFilter ({ commit }) {
    commit('RESET_FILTER')
  },
  async onRefresh ({ commit, dispatch }) {
    commit('SET_FILTER', { key: 'page', value: 1 })
    commit('SET_ORDER_LOADING', true)
    await dispatch('getListOrders')
    commit('SET_ORDER_LOADING', false)
  },
  async onSearch ({ commit, dispatch }, payload) {
    commit('SET_FILTER', { key: 'page', value: 1 })
    commit('SET_FILTER', { key: 'search', value: payload })
    commit('SET_ORDER_LOADING', true)
    await dispatch('getListOrders')
    commit('SET_ORDER_LOADING', false)
  },
  async getListOrders ({ commit, getters }) {
    try {
      commit('SET_ORDER_LOADING', true)
      const res = await this.$axios.$get(ORDER_API.GET_LIST_ORDER, { params: getters.params })
      if (res?.data) {
        commit('SET_LIST_ORDERS', res.data.orders)
        commit('SET_TOTAL', res.data.total)
        if (getters.params?.orderStatus === STATUS_PENDING_ORDER) {
          commit('SET_TOTAL_PENDING_ORDER', res.data.total)
        }
      }
      commit('SET_ORDER_LOADING', false)
    } catch (error) {
      commit('SET_ORDER_LOADING', false)
      console.error(error)
    }
  },
  async getCurrentPendingOrder ({ dispatch, getters }, { $axios, redirect, displayMode }) {
    try {
      const { data } = await $axios.get(ORDER_API.GET_LIST_ORDER, { params: getters.params })
      if (data?.data?.items?.length) {
        const order = data?.data?.items[0]
        if (![ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(order.status)) {
          const type = order.type.toLowerCase()
          redirect({
            path: `/${type}/order-detail/${order.orderRefId}`,
            query: {
              ...((displayMode && order.status === ORDER_STATUS.COMPLETED) && { displayMode })
            }
          })
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}
