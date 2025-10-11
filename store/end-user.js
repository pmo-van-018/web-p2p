/* eslint-disable no-console */
import ORDER_API from '@/api/user-order'
import { SELL_ORDER_MAX_RETRY_SEND_CRYPTO } from '@/resources/send-crypto.js';

export const state = () => ({
  buyOrderInfo: null,
  isSubmitLoading: false,
  submitHashTimeRemaining: 0,
  secretKey: '',
  isMarkAsteriskContent: true
});

export const mutations = {
  SET_BUY_INFO (state, payload) {
    state.buyOrderInfo = payload;
  },
  UPDATE_BUY_INFO (state, payload) {
    state.buyOrderInfo.status = payload.status;
  },
  SET_LOADING_SUBMIT (state, payload) {
    state.isSubmitLoading = payload
  },
  SET_SUBMIT_HASH_TIME_REMAIN (state, payload) {
    state.submitHashTimeRemaining = payload;
  },
  RESET_SUBMIT_HASH_TIME_REMAIN (state, payload) {
    state.submitHashTimeRemaining = 0;
  },
  SET_APPEAL_SECRET (state, payload) {
    state.secretKey = payload;
  },
  SET_MARK_ASTERISK_CONTENT (state, payload) {
    state.isMarkAsteriskContent = payload;
  },
  CLEAR_SECRET_KEY (state) {
    state.secretKey = '';
  }
};

export const actions = {
  async fetchDataBuyInfo ({ commit }, refId) {
    try {
      const result = await this.$axios.$get(`${ORDER_API.BUY_INFO}/${refId}`);
      if (result?.data) {
        commit('SET_BUY_INFO', result.data)
      }
      return result;
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async fetchDataSellInfo ({ commit }, refId) {
    try {
      const result = await this.$axios.$get(`${ORDER_API.SELL_INFO}/${refId}`);
      if (result?.data) {
        commit('SET_BUY_INFO', result.data)
        if (result.data?.transactions?.length) {
          commit('SET_SUBMIT_HASH_TIME_REMAIN', SELL_ORDER_MAX_RETRY_SEND_CRYPTO - result.data?.transactions?.length)
        }
      }
      return result;
    } catch (e) {
      console.error(e)
      throw e
    }
  },
  async createOrder ({ commit }, payload) {
    try {
      commit('SET_LOADING_SUBMIT', true)
      const result = await this.$axios.$post(ORDER_API.BUY_CRYPTO, payload);
      if (result?.data?.id) {
        commit('CLEAR_SECRET_KEY')
      }
      commit('SET_LOADING_SUBMIT', false)
      return result;
    } catch (e) {
      console.log(e)
      commit('SET_LOADING_SUBMIT', false)
      throw e;
    }
  },
  async createSellOrder ({ commit }, payload) {
    try {
      commit('SET_LOADING_SUBMIT', true)
      const result = await this.$axios.$post(ORDER_API.SELL_CRYPTO, payload);
      if (result?.data?.id) {
        commit('CLEAR_SECRET_KEY')
      }
      commit('SET_LOADING_SUBMIT', false)
      commit('RESET_SUBMIT_HASH_TIME_REMAIN')
      return result;
    } catch (e) {
      console.log(e)
      commit('SET_LOADING_SUBMIT', false)
      throw e;
    }
  },
  async cancelBuy ({ commit }, payload) {
    try {
      const result = await this.$axios.$put(ORDER_API.CANCEL_BUY, payload);
      return result;
    } catch (e) {
      console.log(e)
    }
  },
  async cancelSell ({ commit }, payload) {
    try {
      const result = await this.$axios.$put(ORDER_API.CANCEL_SELL, payload);
      return result;
    } catch (e) {
      console.log(e)
    }
  },
  async confirmPayment ({ commit }, payload) {
    try {
      return await this.$axios.$put(ORDER_API.CONFIRM_PAYMENT, payload);
    } catch (e) {
      console.log(e)
    }
  },
  async confirmReceived ({ commit }, payload) {
    try {
      await this.$axios.$put(ORDER_API.CONFIRM_RECEIVED, payload);
    } catch (e) {
      console.log(e)
    }
  },
  async getListOrder ({ commit }, query) {
    try {
      const result = await this.$axios.$get(`${ORDER_API.GET_LIST_ORDER}${query}`);
      return result;
    } catch (e) {
      console.log(e)
    }
  },
  async submitCryptoTransaction ({ commit }, payload) {
    try {
      const result = await this.$axios.$post(ORDER_API.SUBMIT_CRYPTO_TRANSACTION, payload);
      return result;
    } catch (e) {
      console.log(e)
    }
  },
  setBuyInfo ({ commit, state }, payload) {
    commit('SET_BUY_INFO', payload)
  },
  setSubmitHashTime ({ commit }, payload) {
    commit('SET_SUBMIT_HASH_TIME_REMAIN', payload)
  },
  setSecret ({ commit, state }, payload) {
    commit('SET_APPEAL_SECRET', payload)
  },
  setMarkAsteriskContent ({ commit, state }, payload) {
    commit('SET_MARK_ASTERISK_CONTENT', payload)
  }
};
