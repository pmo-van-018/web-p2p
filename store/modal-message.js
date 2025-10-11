export const state = () => ({
  type: 'manual',
  messages: [],
  api: '',
  messageContent: '',
  isShow: false,
  forceReload: false,
  showConnectWallet: false,
  isPreventClose: false
})

export const mutations = {
  INIT_MODAL (state, modalData) {
    state.type = modalData.type;
    state.messages = modalData.message;
    state.messageContent = modalData.messageContent;
    state.api = modalData.api;
    state.forceReload = modalData.forceReload;
    state.isShow = modalData.isShow;
    state.showConnectWallet = modalData.showConnectWallet;
    state.isPreventClose = modalData.isPreventClose
  }
}

export const actions = {
  initModal ({ commit }, modalData) {
    commit('INIT_MODAL', modalData)
  }
}
