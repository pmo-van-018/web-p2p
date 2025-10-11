export const state = () => ({
  otpProcessing: false
})

export const mutations = {
  SET_OTP_PROCESSING (state, payload) {
    state.otpProcessing = payload
  }
}

export const actions = {
  setOtpProcessing ({ commit }, payload) {
    commit('SET_OTP_PROCESSING', payload)
  }
};
