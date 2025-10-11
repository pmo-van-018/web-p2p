import POST_API from '@/api/post'
import { LIST_STATUS, STATUS_AVAILABLE_FILTER } from '@/resources/postings-management'
import { mergeByProp } from '@/helper'
import { POST_STATUS_TYPE } from '@/constants/posts'

const DEFAULT_FILTER = {
  page: 1,
  limit: 10,
  postType: '',
  total: 0,
  status: STATUS_AVAILABLE_FILTER,
  assetId: '',
  orderField: 'updatedAt',
  orderDirection: 'DESC',
  isLoading: false
}
export const state = () => ({
  posts: [],
  page: 1,
  limit: 10,
  total: 0,
  postType: '',
  status: STATUS_AVAILABLE_FILTER,
  assetId: '',
  orderField: 'updatedAt',
  orderDirection: 'DESC',
  isLoading: false,
  currentPosting: {
    id: 0,
    isClose: false,
    status: '',
    isLoading: false
  }
})

export const mutations = {
  SET_POSTS (state, payload) {
    state.posts = payload
  },
  SET_POSTS_ALL (state, payload) {
    state.posts = mergeByProp(state.posts, payload, 'id')
  },
  SET_FILTER (state, { key, value }) {
    state[key] = value
  },
  SET_IS_LOADING (state, payload) {
    state.isLoading = payload
  },
  SET_TOTAL (state, payload) {
    state.total = payload
  },
  RESET_FILTER (state) {
    state = { ...state, ...DEFAULT_FILTER }
  },
  SET_CURRENT_POST (state, payload) {
    state.currentPosting = payload
  }
}
export const getters = {
  params: (state) => {
    const filter = {}
    state.page && (filter.page = state.page)
    state.postType && (filter.type = state.postType)
    state.limit && (filter.limit = state.limit)
    state.assetId && (filter.assetId = state.assetId)
    state.status !== '' ? (filter.status = state.status) : (filter.status = STATUS_AVAILABLE_FILTER)
    state.orderField && state.orderDirection ? (filter.orderField = state.orderField) : (filter.orderField = 'createdAt')
    state.orderField && state.orderDirection ? (filter.orderDirection = state.orderDirection) : (filter.orderDirection = 'DESC')
    return filter
  },
  postsListing (state) {
    return state.posts.filter(post => post.status !== POST_STATUS_TYPE.CLOSE)
  },
  postsHistories (state) {
    return state.posts.filter(post => post.status === POST_STATUS_TYPE.CLOSE)
  }
}
export const actions = {
  async onRefresh ({ commit, dispatch }) {
    commit('SET_FILTER', { key: 'page', value: 1 })
    await dispatch('getPostingList')
  },
  async onResetFilter ({ commit, dispatch }) {
    commit('RESET_FILTER')
    await dispatch('getPostingList')
  },
  onResetStateFilter ({ commit }) {
    for (const [key, value] of Object.entries(DEFAULT_FILTER)) {
      commit('SET_FILTER', { key, value })
    }
  },
  onSetCurrentPost ({ commit }, payload) {
    commit('SET_CURRENT_POST', payload)
  },
  async onSearch ({ commit, dispatch }, payload) {
    commit('SET_FILTER', { key: 'page', value: 1 })
    commit('SET_FILTER', { key: 'search', value: payload })
    await dispatch('getPostingList')
  },
  async updateMultiFilter ({ commit, dispatch }, payload) {
    for (const [key, value] of Object.entries(payload)) {
      commit('SET_FILTER', { key, value })
    }
    await dispatch('getPostingList', payload.isSetAllPost)
  },
  async onLoadInfinitePost ({ commit, dispatch }, payload) {
    for (const [key, value] of Object.entries(payload)) {
      commit('SET_FILTER', { key, value })
    }
    await dispatch('getPostingList', true)
  },
  async updateFilter ({ commit, dispatch }, { key, value }) {
    commit('SET_FILTER', { key, value })
    await dispatch('getPostingList')
  },
  async getPostingList ({ commit, getters }, isSetAllPost = false) {
    try {
      commit('SET_IS_LOADING', true)
      const res = await this.$axios.$get(POST_API.GET_LIST, { params: getters.params })
      if (res?.data) {
        if (isSetAllPost) {
          commit('SET_POSTS_ALL', res.data.items)
        } else {
          commit('SET_POSTS', res.data.items)
        }
        commit('SET_TOTAL', res.data.totalItems)
      }
      commit('SET_IS_LOADING', false)
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error)
      commit('SET_IS_LOADING', false)
    }
  },
  async closePosting ({ commit, getters, dispatch }, postId) {
    try {
      const res = await this.$axios.$put(POST_API.CLOSE(postId))
      if (!res?.errors || !res?.errors.length) {
        commit('SET_FILTER', { key: 'page', value: 1 })
        await dispatch('getPostingList')
      }
      return res
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  async toggleStatusPosting ({ commit, getters, dispatch }, { id, status }) {
    const showAd = status === LIST_STATUS.ONLINE.name ? 0 : 1
    try {
      const res = await this.$axios.$put(POST_API.UPDATE_STATUS(id), {
        showAd
      })
      if (!res?.errors || !res?.errors.length) {
        await dispatch('updateMultiFilter', { page: 1 })
      }
      return res
    } catch (error) {
      console.error(error)
      throw error
    }
  }
}
