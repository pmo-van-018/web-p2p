import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
import { APPEAL_STATUS } from '@/constants/appeals';
import { POST_TYPE } from '@/config/constant';

export default {
  computed: {
    step () {
      return this.order?.step
    },
    isPostTypeBuy () {
      return this.order.postType === POST_TYPE.BUY
    },
    hasAppeal () {
      return this.order?.appeal && !(this.order?.appeal?.status === APPEAL_STATUS.OPEN)
    },
    isVisibleAppealButton () {
      return [
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED,
        SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER
      ].includes(this.step)
    },
    isVisibleChatButton () {
      return (
        !!this.order.roomId ||
        [
          BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME,
          BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER,
          SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS,
          SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
        ].includes(this.step) ||
        ([
          BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
          BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
          SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT
        ].includes(this.step) &&
          this.hasAppeal) ||
        ([
          BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME
        ].includes(this.step) &&
          (this.order?.isSupporter || this.order?.supporterView))
      );
    }
  },
  methods: {
    isShowAppealModal (order) {
      return [
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED,
        BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_FAILED,
        SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER,
        SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
      ].includes(order?.step) && !!order?.appeal
    },
    onTermTransfer () {
      this.$emit('on-term-transfer', this.order)
    }
  }
}
