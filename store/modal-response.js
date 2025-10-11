export const state = () => ({
  type: 'error',
  show: false,
  icon: '',
  title: '',
  content: '',
  description: '',
  confirmAction: '',
  confirmActionType: '',
  visibleClose: true,
  preventClose: false,
  forceReload: false,
  thumbClass: ''
})

export const mutations = {
  INIT_MODAL (state, payload) {
    const {
      type = 'error',
      title,
      show = false,
      content,
      description,
      confirmAction,
      confirmActionType,
      icon,
      visibleClose = true,
      preventClose = false,
      forceReload = false,
      thumbClass
    } = payload
    state.type = type;
    state.show = show;
    state.icon = icon;
    state.title = title;
    state.content = content;
    state.description = description;
    state.confirmAction = confirmAction;
    state.confirmActionType = confirmActionType;
    state.visibleClose = visibleClose;
    state.preventClose = preventClose;
    state.forceReload = forceReload;
    state.thumbClass = thumbClass;
  },
  RESET_MODAL (state) {
    state.type = 'error';
    state.show = false;
    state.icon = '';
    state.title = '';
    state.content = '';
    state.description = '';
    state.icon = '';
    state.confirmAction = '';
    state.confirmActionType = '';
    state.visibleClose = true;
    state.preventClose = false;
    state.forceReload = false;
    state.thumbClass = '';
  }
}

export const actions = {
  showResponseModal ({ commit }, payload) {
    commit('INIT_MODAL', payload)
  },
  resetResponseModal ({ commit }) {
    commit('RESET_MODAL')
  }
}
