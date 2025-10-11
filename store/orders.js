export const state = () => ({
  order: null,
  orderSocket: null
})

export const mutations = {
  SET_ORDER (state, payload) {
    state.order = payload
    state.orderSocket = payload
  }
}
export const actions = {
  setOrder ({ commit }, payload) {
    commit('SET_ORDER', payload)
  }
}
