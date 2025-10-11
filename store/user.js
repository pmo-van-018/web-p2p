/* eslint-disable no-console */
import USER_API from '@/api/user';
import { USER_ROLE } from '@/config/constant';

export const state = () => ({
  user: null,
  balance: 0,
  iconNetwork: '',
  statusUserSocket: null,
  lockedUserData: null,
  isLoadingIconNetwork: true,
  isShiftProcessing: null
});

export const mutations = {
  SET_USER (state, payload) {
    state.user = payload
  },
  SET_BALANCE (state, payload) {
    state.balance = payload
  },
  SET_ICON_NETWORK (state, payload) {
    state.iconNetwork = payload
  },
  SET_IS_LOADING_ICON_NETWORK (state, payload) {
    state.isLoadingIconNetwork = payload
  },
  SET_STATUS_USER_SOCKET (state, payload) {
    state.statusUserSocket = payload;
  },
  SET_LOCKED_USER_DATA (state, payload) {
    state.lockedUserData = payload;
  },
  SET_IS_SHIFT_PROCESSING (state, payload) {
    state.isShiftProcessing = payload;
  }
}
export const getters = {
  enableLightDarkMode (state) {
    return !state.user || state.user?.type === USER_ROLE.USER
  }
}
export const actions = {
  setBalance ({ commit }, payload) {
    commit('SET_BALANCE', payload)
  },
  setIconNetwork ({ commit }, payload) {
    commit('SET_ICON_NETWORK', payload)
  },
  setUser ({ commit }, payload) {
    commit('SET_USER', payload);
  },
  setIsLoadingIconNetwork ({ commit }, payload) {
    commit('SET_IS_LOADING_ICON_NETWORK', payload)
  },
  setIsShiftProcessing ({ commit }, payload) {
    commit('SET_IS_SHIFT_PROCESSING', payload)
  },
  setStatusUserSocket ({ commit }, payload) {
    commit('SET_STATUS_USER_SOCKET', payload)
  },
  async getInfoUser ({ commit }) {
    try {
      const result = await this.$axios.$get(USER_API.INFO);
      if (result && result.data) {
        commit('SET_USER', result.data);
      }
      return result;
    } catch (e) {
    }
  }
};
