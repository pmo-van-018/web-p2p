import MASTER_DATA_API from '@/api/master-data';

export const state = () => ({
  assetMaintenance: [],
  walletMaintenance: [],
  news: []
})

export const getters = {
  hasMaintenance: state => (state.walletMaintenance.length || state.assetMaintenance.length || state.news.length)
}

export const mutations = {
  SET_ASSET_MAINTENANCE (state, payload) {
    state.assetMaintenance = payload
  },
  SET_WALLET_MAINTENANCE (state, payload) {
    state.walletMaintenance = payload
  },
  SET_NEWS (state, payload) {
    state.news = payload
  }
}
export const actions = {
  async getMaintenance ({ commit }) {
    try {
      const [maintenancesResponse, newsResponse] = await Promise.all([
        this.$axios.$get(MASTER_DATA_API.GET_MAINTENANCE),
        this.$axios.$get(MASTER_DATA_API.GET_NEWS)
      ])
      commit('SET_ASSET_MAINTENANCE', maintenancesResponse.data?.assetMaintenance || [])
      commit('SET_WALLET_MAINTENANCE', maintenancesResponse?.data?.walletMaintenance || [])
      commit('SET_NEWS', newsResponse.data?.items || [])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }
}
