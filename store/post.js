/* eslint-disable no-console */
import { POST_TYPE } from '@/config/constant'
import POST_API from '@/api/post';
import { getTotalPage, mergeByProp } from '@/helper'

export const state = () => ({
  posts: [],
  idPostClone: null,
  currentPage: 1,
  totalPage: 0,
  total: 0,
  perPage: 10,
  assetName: 'VIC',
  assetNetwork: 'VChain',
  fiat: 'VND',
  amount: null,
  minAmount: 0,
  maxAmount: 0,
  sortDirection: '',
  type: POST_TYPE.SELL,
  isLoading: false,
  isLoadingRefresh: false,
  searchOptions: {},
  prices: [],
  refreshOptions: {},
  refreshIntervalId: null,
  refreshPause: false,
  postStatus: [],
  path: ''
})

export const mutations = {
  SET_POSTS (state, payload) {
    state.posts = payload
  },
  MERGE_POSTS (state, payload) {
    state.posts = mergeByProp(state.posts, payload, 'id')
  },
  SET_POST_CLONE (state, payload) {
    state.idPostClone = payload
  },
  SET_CURRENT_PAGE (state, payload) {
    state.currentPage = payload
  },
  SET_TOTAL_PAGE (state, payload) {
    state.totalPage = payload
  },
  SET_TOTAL (state, payload) {
    state.total = payload
  },
  SET_PER_PAGE (state, payload) {
    state.perPage = payload
  },
  SET_AMOUNT (state, payload) {
    state.amount = payload
  },
  SET_MIN_AMOUNT (state, payload) {
    state.minAmount = payload;
  },
  SET_MAX_AMOUNT (state, payload) {
    state.maxAmount = payload;
  },
  SET_TYPE (state, payload) {
    state.type = payload
  },
  SET_IS_LOADING (state, payload) {
    state.isLoading = payload
  },
  SET_IS_REFRESH_LOADING (state, payload) {
    state.isLoadingRefresh = payload
  },
  SET_ASSET_NAME (state, payload) {
    state.assetName = payload
  },
  SET_ASSET_NETWORK (state, payload) {
    state.assetNetwork = payload
  },
  SET_FILTER (state, { key, value }) {
    state[key] = value
  },
  SET_SEARCH_OPTIONS (state, payload) {
    state.searchOptions = payload;
  },
  SET_PRICES (state, payload) {
    state.prices = payload
  },
  SET_REFRESH_OPTION (state, payload) {
    state.refreshOptions = payload
  },
  SET_INTERVAL_ID (state, payload) {
    state.refreshIntervalId = payload
  },
  SET_PAUSE_REFRESH (state, payload) {
    state.refreshPause = payload
  },
  SET_POST_STATUS (state, payload) {
    state.postStatus = payload
  },
  SET_PATH (state, payload) {
    state.path = payload
  },
  SET_SORT_DIRECTION (state, payload) {
    state.sortDirection = payload
  }
}
export const getters = {
  params: state => ({
    assetName: state.assetName,
    assetNetwork: state.assetNetwork,
    fiat: state.fiat,
    page: state.currentPage,
    limit: state.perPage,
    amount: state.amount,
    minAmount: state.minAmount,
    maxAmount: state.maxAmount,
    type: state.type,
    path: state.path,
    sortDirection: state.sortDirection
  }),
  refreshOption: state => ({
    refreshIntervalId: state.refreshIntervalId,
    refreshOptions: state.refreshOptions
  })
}

export const actions = {
  setPathSearchPost ({ commit }, path) {
    commit('SET_PATH', path);
  },
  async getPostStatus ({ commit, state }) {
    const postIds = state.posts.map(e => e.id)
    if (!postIds?.length) {
      return;
    }
    try {
      const res = await this.$axios.$post(POST_API.POST_STATUS, { postIds });
      if (res?.data) {
        commit('SET_POST_STATUS', res.data.identifier)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
  async getListPost ({ commit, getters, dispatch, $axios }, isMerged = false) {
    try {
      const { params } = getters;
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      commit('SET_IS_LOADING', true)
      commit('SET_IS_REFRESH_LOADING', true)
      const res = await this.$axios.$get(params.path, { params });
      if (res?.data) {
        if (isMerged) {
          commit('MERGE_POSTS', res.data.items)
        } else {
          commit('SET_POSTS', res.data.items)
        }
        await dispatch('getPostStatus');
        commit('SET_TOTAL', res.data.totalItems)
        const totalPage = getTotalPage(res.data.totalItems, params.limit)
        commit('SET_TOTAL_PAGE', totalPage)
      }
    } finally {
      commit('SET_IS_LOADING', false)
      commit('SET_IS_REFRESH_LOADING', false)
    }
  },
  async recommendPrice ({ commit }) {
    try {
      const res = await this.$axios.$get(POST_API.RECOMMEND_PRICE);
      if (res?.data) {
        commit('SET_PRICES', res.data.prices)
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  },
  async getSearchOptions ({ commit, getters }) {
    const { assetName, assetNetwork, fiat, type } = getters?.params;
    try {
      const res = await this.$axios.$get(POST_API.GET_AMOUNT_RANGE, {
        params: { assetName, assetNetwork, fiat, type }
      });
      if (res?.data) {
        commit('SET_SEARCH_OPTIONS', res.data);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  },
  async searchPost ({ commit, dispatch }, {
    isLoadSearchOptions,
    assetName,
    assetNetwork,
    limit,
    amount,
    type,
    page,
    minAmount,
    maxAmount,
    path,
    sortDirection,
    isMerge
  }) {
    let shouldUpdateSearchOptions = false;
    if (assetName) {
      commit('SET_ASSET_NAME', assetName);
      shouldUpdateSearchOptions = true;
    }
    if (assetNetwork) {
      commit('SET_ASSET_NETWORK', assetNetwork);
      shouldUpdateSearchOptions = true;
    }
    if (page) {
      commit('SET_CURRENT_PAGE', page)
    }
    if (limit) {
      commit('SET_PER_PAGE', limit)
    }
    if (type) {
      commit('SET_TYPE', type);
      shouldUpdateSearchOptions = true;
    }
    commit('SET_SORT_DIRECTION', sortDirection)
    commit('SET_AMOUNT', amount)
    commit('SET_MIN_AMOUNT', minAmount)
    commit('SET_MAX_AMOUNT', maxAmount)
    commit('SET_CURRENT_PAGE', 1)

    if (isLoadSearchOptions && shouldUpdateSearchOptions) {
      dispatch('getSearchOptions', isLoadSearchOptions);
    }

    if (path) {
      commit('SET_PATH', path);
    }

    await dispatch('getListPost', isMerge)
  },
  onChangePage ({ commit, dispatch }, page) {
    commit('SET_CURRENT_PAGE', page)
    dispatch('getListPost')
  },
  async onRefresh ({ commit, dispatch }) {
    commit('SET_CURRENT_PAGE', 1)
    await dispatch('getListPost')
  },
  clearRefreshIntervalId ({ commit, getters }) {
    const { refreshOption } = getters
    commit('SET_PAUSE_REFRESH', true)
    commit('SET_INTERVAL_ID', null)
    clearInterval(refreshOption.refreshIntervalId)
  },
  resetIntervalId ({ commit, dispatch, getters }) {
    const { refreshOption } = getters
    if (refreshOption.refreshIntervalId) {
      clearInterval(refreshOption.refreshIntervalId)
    }
    if (refreshOption.refreshOptions?.value && refreshOption.refreshOptions?.value !== 0) {
      const intervalId = setInterval(() => {
        dispatch('getListPost')
      }, refreshOption.refreshOptions?.value)
      commit('SET_INTERVAL_ID', intervalId)
    }
    commit('SET_PAUSE_REFRESH', false)
  },
  async onLoadInfinitePost ({ commit, dispatch }, payload) {
    for (const [key, value] of Object.entries(payload)) {
      commit('SET_FILTER', { key, value })
    }
    await dispatch('getListPost', true)
  },
  setPostClone ({ commit }, payload) {
    commit('SET_POST_CLONE', payload)
  },
  setRefreshOption ({ commit }, payload) {
    commit('SET_REFRESH_OPTION', payload)
  },
  setPauseRefresh ({ commit }, payload) {
    commit('SET_PAUSE_REFRESH', payload)
  },
  setRefreshIntervalId ({ commit }, payload) {
    commit('SET_INTERVAL_ID', payload)
    commit('SET_PAUSE_REFRESH', false)
  },
  reset ({ commit }) {
    commit('SET_TYPE', POST_TYPE.SELL)
    commit('SET_POSTS', [])
    commit('SET_CURRENT_PAGE', 1)
    commit('SET_TOTAL', 0)
    commit('SET_PER_PAGE', 10)
    commit('SET_SEARCH_OPTIONS', {})
  },
  setPost ({ commit }, payload) {
    commit('SET_POSTS', payload)
  }
};
