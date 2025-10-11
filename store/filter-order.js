export const state = () => ({
  postType: '',
  assetType: 0,
  orderStatus: '',
  amount: '',
  transCode: '',
  orderField: 'id',
  orderDirection: 'ASC',
  supporterId: ''
});

export const mutations = {
  SET_FILTER (state, { key, value }) {
    state[key] = value;
  }
};

export const actions = {
  updateMultiFilter ({ commit, dispatch }, payload) {
    for (const [key, value] of Object.entries(payload)) {
      commit('SET_FILTER', { key, value })
    }
  },
  resetFilter ({ commit, dispatch }) {
    const resetState = {
      postType: '',
      assetType: 0,
      orderStatus: '',
      amount: '',
      transCode: '',
      orderField: 'id',
      orderDirection: 'ASC',
      supporterId: ''
    }
    dispatch('updateMultiFilter', resetState)
  }
};
