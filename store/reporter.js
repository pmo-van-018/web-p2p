export const state = () => ({
  user: null
});

export const mutations = {
  SET_USER (state, payload) {
    state.user = payload
  }
}
export const actions = {
  setUser ({ commit }, payload) {
    commit('SET_USER', payload);
  }
};
