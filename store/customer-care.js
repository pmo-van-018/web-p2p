export const state = () => ({
  isVisibleCustomerCare: false
})

export const mutations = {
  SET_VISIBLE_CUSTOMER_CARE (state, payload) {
    state.isVisibleCustomerCare = payload
  }
}

export const actions = {
  setVisibleCustomerCare ({ commit }, payload) {
    commit('SET_VISIBLE_CUSTOMER_CARE', payload)
  }
}
