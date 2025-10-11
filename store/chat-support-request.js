import CHAT_API from '@/api/chat'
import { USER_ROLE } from '@/config/constant'

export const state = () => ({
  messages: [],
  isLoadingMessages: false,
  isVisibleChat: false,
  isVisibleCaution: true,
  isFocusInput: false,
  lastMsgId: null,
  chatNoti: false,
  lastMessages: [],
  messageSeen: null,
  socketListeners: [],
  resolvedSupportRequest: false,
  signedCookie: null,
  errorSignCookie: null
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
  SET_RESOLVED_SUPPORT_REQUEST (state, payload) {
    state.resolvedSupportRequest = payload
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
  SET_MESSAGE_SEEN (state, payload) {
    state.messageSeen = payload
  },
  SET_LISTENER_EVENT_SOCKET (state, payload) {
    state.isListenerEventSocket = payload
  },
  SET_SIGNED_COOKIE (state, payload) {
    state.signedCookie = payload
  },
  SET_ERROR_SIGN_COOKIE (state, payload) {
    state.errorSignCookie = payload
  },
  SET_SOCKET_LISTENER (state, payload) {
    if (state.socketListeners.length) {
      if (Array.isArray(payload)) {
        state.socketListeners = [...state.socketListeners, ...payload]
      } else {
        state.socketListeners.push(payload)
      }
    } else {
      state.socketListeners = [...payload]
    }
  },
  RESET_STATE_CHAT (state) {
    state.messages = []
    state.isLoadingMessages = false
    state.isVisibleChat = false
    state.order = null
    state.isFocusInput = false
    state.lastMsgId = null
    state.chatNoti = false
    state.lastMessages = []
    state.messageSeen = null
    state.socketListeners = []
  }
}
export const actions = {
  setMessage ({ commit }, payload) {
    commit('ADD_MESSAGE', payload)
  },
  setMessages ({ commit }, payload) {
    commit('SET_MESSAGES', payload)
  },
  setFocusInput ({ commit }, payload) {
    commit('SET_FOCUS_INPUT', payload)
  },
  setVisibleChat ({ commit }, payload) {
    commit('SET_VISIBLE_CHAT', payload)
  },
  toggleVisibleChat ({ commit }) {
    commit('TOGGLE_VISIBLE_CHAT')
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
  setSocketListeners ({ commit }, payload) {
    commit('SET_SOCKET_LISTENER', payload)
  },
  setReadMessageInList ({ commit, state }, { roomId, seen }) {
    if (state.lastMessages?.length) {
      const isExistLastMessage = state.lastMessages.some(message => message.roomId === roomId)
      let lastMessages;
      if (isExistLastMessage) {
        lastMessages = state.lastMessages.map((message) => {
          if (message.roomId === roomId) {
            return {
              ...message,
              seen
            }
          }
          return message
        })
      } else {
        lastMessages = [...state.lastMessages, { roomId, seen }]
      }
      commit('SET_LAST_MESSAGES', lastMessages)
    } else {
      commit('SET_LAST_MESSAGES', [{ roomId, seen }])
    }
  },
  setResolveSupportRequest ({ commit, state }, payload) {
    if (payload) {
      commit('ADD_MESSAGE', {
        _id: 'processed_message',
        room: state.messages[0]?.room,
        user: {
          _id: 'processed_message',
          type: 'BOT'
        },
        msg: 'Đã xử lý yêu cầu',
        type: 'RAW'
      })
    }
    commit('SET_RESOLVED_SUPPORT_REQUEST', payload)
  },
  async getMessageHistories ({ commit, state }, {
    roomId,
    role
  }) {
    try {
      commit('SET_LOADING_MESSAGES', true)
      const urlApi = [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN_SUPPORTER].includes(role)
        ? CHAT_API.ADMIN_GET_ALL_MESSAGES(roomId)
        : CHAT_API.GET_CHAT_HISTORY(roomId)
      const { data } = await this.$axios.$get(urlApi);
      if (data.length) {
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
  }
}
