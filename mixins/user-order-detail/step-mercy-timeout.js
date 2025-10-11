import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('end-user', ['buyOrderInfo']),
    buyStepMercy () {
      return [
        BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER,
        BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER,
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME
      ].includes(this.buyOrderInfo?.step)
    },
    sellStepMercy () {
      return [
        SELL_ORDER_STEPS.SELL_ORDER_CREATED_BY_USER,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_FAILED,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT
      ].includes(this.buyOrderInfo?.step)
    },
    isVisibleTimeOut () {
      return this.buyStepMercy || this.sellStepMercy || this.timeLeft !== null
    }
  }
}
