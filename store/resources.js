import RESOURCE_API from '@/api/resource';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import pick from 'lodash/pick';
import { NETWORK_CONFIGS } from '@/resources/wallet';

export const state = () => ({
  assets: [],
  fiats: [],
  allAssets: [],
  isResourceLoading: false,
  metadata: null
})

export const mutations = {
  SET_RESOURCES (state, payload) {
    state.assets = payload.assets
    state.fiats = payload.fiats
    state.allAssets = payload.allAssets
    state.metadata = payload.metadata
  },
  SET_RESOURCES_LOADING (state, payload) {
    state.isResourceLoading = payload
  }
}
export const getters = {
  params: state => ({
    assets: state.assets,
    fiats: state.fiats
  }),
  networkConfigs: (state) => {
    const groupByAssets = groupBy(state.allAssets, 'network')
    return reduce(groupByAssets, (result, value, key) => {
      const assetPicked = pick(value[0], ['chainId', 'rpc', 'explorerUrls'])
      const configPicked = pick(NETWORK_CONFIGS[key], ['iconNetwork', 'nativeCurrency', 'chainName'])
      result[key] = { ...assetPicked, ...configPicked }
      return result
    }, {})
  }
}

export const actions = {
  async getResources ({ commit }) {
    try {
      commit('SET_RESOURCES_LOADING', true)
      const res = await this.$axios.$get(RESOURCE_API.GET_ALL);
      if (res?.data) {
        commit('SET_RESOURCES', res.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      commit('SET_RESOURCES_LOADING', false)
    }
  }
};
