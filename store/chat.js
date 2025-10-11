import CHAT_API from '@/api/chat'
import { USER_ROLE } from '@/config/constant'

export const state = () => ({
  messages: [],
  isLoadingMessages: false,
  signedCookie: null,
  isVisibleChat: false,
  isVisibleCaution: true,
  order: null,
  errorSignCookie: null,
  isFocusInput: false,
  lastMsgId: null,
  chatNoti: false,
  lastMessages: [],
  messageSeen: null,
  isErrorRateLimit: false,
  socketListeners: []
})

export const getters = {
  signedCookieQueryParam (state) {
    if (state.signedCookie === null) {
      return ''
    }
    return Object.keys(state.signedCookie)
      .map(item => `${item.replace(/CloudFront-/g, '')}=${state.signedCookie[item]}`).join('&')
  }
}
export const mutations = {
  SET_MESSAGES (state, payload) {
    state.messages = payload
  },
  SET_VISIBLE_CAUTION (state, payload) {
    state.isVisibleCaution = payload
  },
  TOGGLE_VISIBLE_CHAT (state) {
    state.isVisibleChat = !state.isVisibleChat
  },
  SET_VISIBLE_CHAT (state, payload) {
    state.isVisibleChat = payload
  },
  ADD_MESSAGE (state, payload) {
    if (state.messages[state.messages.length - 1]?._id !== payload?._id) {
      state.messages.push(payload)
    }
  },
  SET_LOADING_MESSAGES (state, payload) {
    state.isLoadingMessages = payload
  },
  SET_SIGNED_COOKIE (state, payload) {
    state.signedCookie = payload
  },
  SET_ORDER (state, payload) {
    state.order = payload
  },
  SET_ERROR_SIGN_COOKIE (state, payload) {
    state.errorSignCookie = payload
  },
  SET_FOCUS_INPUT (state, payload) {
    state.isFocusInput = payload
  },
  SET_LAST_MESSAGE_ID (state, payload) {
    state.lastMsgId = payload
  },
  SET_CHAT_NOTI (state, payload) {
    state.chatNoti = payload
  },
  SET_LAST_MESSAGES (state, payload) {
    state.lastMessages = payload
  },
  REMOVE_AN_ITEM_LAST_MESSAGES: (state, payload) => {
    const i = state.lastMessages.map(item => item.id).indexOf(payload.id)
    state.lastMessages.splice(i, 1)
  },
  SET_MESSAGE_SEEN (state, payload) {
    state.messageSeen = payload
  },
  SET_LISTENER_EVENT_SOCKET (state, payload) {
    state.isListenerEventSocket = payload
  },
  SET_ERROR_RATE_LIMIT (state, payload) {
    state.isErrorRateLimit = payload
  },
  SET_SOCKET_LISTENER (state, payload) {
    const uniquePayload = Array.isArray(payload) ? payload : [payload];
    state.socketListeners = Array.from(new Set([...state.socketListeners, ...uniquePayload]));
  },
  RESET_STATE_CHAT (state) {
    state.messages = []
    state.isLoadingMessages = false
    state.signedCookie = null
    state.isVisibleChat = false
    state.order = null
    state.errorSignCookie = null
    state.isFocusInput = false
    state.lastMsgId = null
    state.chatNoti = false
    state.lastMessages = []
    state.messageSeen = null
    state.socketListeners = []
    state.isErrorRateLimit = false
  }
}
export const actions = {
  setMessage ({ commit }, payload) {
    commit('ADD_MESSAGE', payload)
  },
  setFocusInput ({ commit }, payload) {
    commit('SET_FOCUS_INPUT', payload)
  },
  setVisibleChat ({ commit }, payload) {
    commit('SET_VISIBLE_CHAT', payload)
  },
  setVisibleCaution ({ commit }, payload) {
    commit('SET_VISIBLE_CAUTION', payload)
  },
  toggleVisibleChat ({ commit }) {
    commit('TOGGLE_VISIBLE_CHAT')
  },
  setOrder ({ commit }, payload) {
    commit('SET_ORDER', payload)
  },
  setChatNoti ({ commit }) {
    commit('SET_CHAT_NOTI', true)
  },
  setLastMessageId ({ commit }, payload) {
    commit('SET_LAST_MESSAGE_ID', payload)
    commit('SET_CHAT_NOTI', false)
  },
  resetStateChat ({ commit }) {
    commit('RESET_STATE_CHAT')
  },
  setListenerEventSocket ({ commit }, payload) {
    commit('SET_LISTENER_EVENT_SOCKET', payload)
  },
  setLastMessages ({ commit }, payload) {
    commit('SET_LAST_MESSAGES', payload)
  },
  removeAnItemInLastMessages ({ commit }, payload) {
    commit('REMOVE_AN_ITEM_LAST_MESSAGES', payload)
  },
  setSocketListeners ({ commit }, payload) {
    commit('SET_SOCKET_LISTENER', payload)
  },
  setErrorRateLimit ({ commit }, payload) {
    commit('SET_ERROR_RATE_LIMIT', payload)
  },
  setReadMessageInList ({ commit, state }, { roomId, seen }) {
    if (roomId) {
      const lastMessages = state.lastMessages ? [...state.lastMessages] : [];

      const existingMessageIndex = lastMessages.findIndex(message => message.roomId === roomId);

      if (existingMessageIndex !== -1) {
        lastMessages[existingMessageIndex] = { ...lastMessages[existingMessageIndex], seen };
      } else {
        lastMessages.push({ roomId, seen });
      }

      commit('SET_LAST_MESSAGES', lastMessages);
    }
  },
  async getMessageHistories ({ commit }, {
    roomId,
    role
  }) {
    try {
      commit('SET_LOADING_MESSAGES', true)
      const urlApi = [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(role)
        ? CHAT_API.ADMIN_GET_CHAT_HISTORY(roomId)
        : CHAT_API.GET_CHAT_HISTORY(roomId)
      const { statusCode, data } = await this.$axios.$get(urlApi);
      if (statusCode === 200 && data.length) {
        commit('SET_MESSAGES', data)
        return;
      }
      commit('SET_MESSAGES', [])
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => {
        commit('SET_LOADING_MESSAGES', false)
      }, 1000)
    }
  },
  async getSignedCookie ({ commit }, {
    roomId,
    role
  }) {
    try {
      const urlApi = [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(role)
        ? CHAT_API.ADMIN_SIGNED_COOKIE(roomId)
        : CHAT_API.SIGNED_COOKIE(roomId)
      const { statusCode, data } = await this.$axios.$get(urlApi);
      if (statusCode === 200 && data) {
        commit('SET_SIGNED_COOKIE', data)
      }
    } catch (err) {
      console.error(err)
      commit('SET_ERROR_SIGN_COOKIE', null)
    }
  },
  async getLastMessage ({ commit }, roomId) {
    try {
      const urlApi = CHAT_API.GET_LAST_MESSAGE(roomId)
      const { statusCode, data } = await this.$axios.$get(urlApi);
      if (statusCode === 200 && data) {
        commit('SET_LAST_MESSAGE_ID', data.msgId)
      }
    } catch (err) {
      console.error(err)
    }
  },
  async getLastMessages ({ commit }, roomIds) {
    try {
      const urlApi = CHAT_API.GET_LAST_MESSAGES
      const { statusCode, data } = await this.$axios.$post(urlApi, {
        roomIds
      });
      if (statusCode === 201 && data) {
        commit('SET_LAST_MESSAGES', data)
        return;
      }
      commit('SET_LAST_MESSAGES', [])
    } catch (err) {
      console.error(err)
      commit('SET_LAST_MESSAGES', [])
    }
  }
}
