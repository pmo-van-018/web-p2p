import { BUY_ORDER_STEPS, SELL_ORDER_STEPS, STEPS_COUNTDOWN, SUB_KEY_DESCRIPTION_STEP } from '@/constants/orders'
import { ORDER_STATUS } from '@/config/constant'
import { BUY_APPEAL_RESULTS } from '@/constants/appeals';

export default {
  data () {
    return {
      isTimeOut: false
    }
  },
  computed: {
    timeout () {
      return this.order?.timeout || null
    },
    appeal () {
      return this.order?.appeal || null
    },
    isTimeOutFreeze () {
      return SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME === this.step && this.isTimeOut
    },
    pauseCountdown () {
      return this.order.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_BY_USER
    },
    timeoutMilliSeconds () {
      return this.$options.filters.convertToMilliseconds(this.timeout)
    },
    step () {
      return this.order?.step || ''
    },
    isVisibleTimeOut () {
      return STEPS_COUNTDOWN.includes(this.step) && !!this.timeoutMilliSeconds && !this.isTimeOutFreeze
    },
    isWarningTimeOut () {
      return [
        SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT
      ].includes(this.step)
    },
    processDescriptionHistory () {
      if (this.order?.status === ORDER_STATUS.CANCELLED) {
        if ([SELL_ORDER_STEPS.SELL_ORDER_CANCELLED_BY_USER, BUY_ORDER_STEPS.BUY_ORDER_CANCELLED_BY_USER].includes(this.step)) {
          return this.$t('user_orders.order-status.buyer-cancel')
        } else {
          return this.$t('user_orders.order-status.system-cancel')
        }
      } else {
        return ''
      }
    },
    processDescriptionCountdown () {
      if (!this.step || ORDER_STATUS.COMPLETED === this.order?.status) {
        return ''
      }
      if (this.processDescriptionHistory) {
        return this.processDescriptionHistory
      }
      if (this.isTimeOutFreeze) {
        return this.$t(`user_orders.process.${this.step}.${SUB_KEY_DESCRIPTION_STEP.TIMEOUT}`)
      }
      if ([BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME]
        .includes(this.step)) {
        if (this.isVisibleTimeOut) {
          return this.$t(`user_orders.process.${this.step}.${SUB_KEY_DESCRIPTION_STEP.COUNTDOWN}`)
        }
        if (this.appeal && this.appeal?.decisionResult === BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN) {
          return this.$t(`user_orders.process.${this.step}.${SUB_KEY_DESCRIPTION_STEP.APPEAL}`)
        }
        return this.$t(`user_orders.process.${this.step}.${SUB_KEY_DESCRIPTION_STEP.TIMEOUT}`)
      }
      return this.$t(`user_orders.process.${this.step}`)
    }
  },
  methods: {
    onTimeOut () {
      this.isTimeOut = true
    }
  }
}
