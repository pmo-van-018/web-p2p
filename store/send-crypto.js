import { SENDING_CRYPTO_STATUS } from '@/config/constant';

export const state = () => ({
  confirmSendCryptoInfo: {
    status: SENDING_CRYPTO_STATUS.PROCESSING,
    amount: 0,
    asset: 'VIC',
    orderId: '',
    title: '',
    subTitle: ''
  },
  resultSendCryptoInfo: {
    status: 'PENDING',
    hash: '',
    network: '',
    orderId: ''
  }
});

export const mutations = {
  SET_CONFIRM_SEND_CRYPTO_INFO (state, payload) {
    state.confirmSendCryptoInfo = payload;
  },
  SET_RESULT_SEND_CRYPTO_INFO (state, payload) {
    state.resultSendCryptoInfo = payload;
  },
  RESET_RESULT_SEND_CRYPTO_INFO (state) {
    state.resultSendCryptoInfo = {
      status: 'PENDING',
      hash: '',
      network: '',
      orderId: '',
      title: '',
      subTitle: ''
    };
  }
};

export const actions = {
  setConfirm ({ commit }, data) {
    commit('SET_CONFIRM_SEND_CRYPTO_INFO', data)
  },
  setResult ({ commit }, data) {
    commit('SET_RESULT_SEND_CRYPTO_INFO', data)
  },
  reset ({ commit }) {
    commit('RESET_RESULT_SEND_CRYPTO_INFO')
  }
}
