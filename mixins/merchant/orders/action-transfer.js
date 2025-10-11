import dayjs from 'dayjs'
import { mapState } from 'vuex';
import { APPEAL_STATUS, BUY_APPEAL_RESULTS } from '@/constants/appeals';
import { TRANSACTION_STATUS } from '@/constants/transaction';
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS, STEPS_COUNTDOWN, SUB_KEY_DESCRIPTION_STEP } from '~/constants/orders'
import { ORDER_STATUS, POST_TYPE, USER_ROLE } from '~/config/constant'
import actionAppealMixin from '~/mixins/merchant/orders/action-appeal'

export default {
  mixins: [actionAppealMixin],
  computed: {
    ...mapState('orders', ['orderSocket']),
    ...mapState('user', ['user']),
    isPostTypeBuy () {
      return this.order.postType === POST_TYPE.BUY
    },
    step () {
      return this.order?.step || ''
    },
    assetName () {
      return this.order?.assetName || 'VIC'
    },
    isHasTimeOut () {
      return !!this.order?.timeout
    },
    isTimeout () {
      return !this.timeout || false
    },
    isPauseCountdown () {
      return this.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_BY_USER
    },
    lastTransaction () {
      return this.order?.transactions?.length
        ? this.order?.transactions[this.order?.transactions?.length - 1]
        : null
    },
    isSendingCryptoFailedWithTransactionUnknown () {
      return this.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_BY_USER && this.lastTransaction?.status === TRANSACTION_STATUS.UNKNOWN
    },
    isWarningTimeOut () {
      return [
        BUY_ORDER_STEPS.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT
      ].includes(this.step)
    },
    isAppealOpen () {
      return this.order.appeal?.status === APPEAL_STATUS.OPEN
    },
    isAppealReOpen () {
      return this.order.appeal?.decisionResult === BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN
    },
    hasAppeal () {
      return !!this.order?.appeal && !this.isAppealOpen
    },
    timeoutMilliseconds () {
      if (this.order?.timeout === null) {
        return null
      }
      const timeout = this.isHasTimeOut ? this.order.timeout
        : 0
      return this.$options.filters.convertToMilliseconds(timeout)
    },
    isVisibleTimeOut () {
      // step no change, countdown to the end
      if (this.isAppealOpen || this.isSendingCryptoFailedWithTransactionUnknown) {
        return false
      }
      if ([
        BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
      ].includes(this.order?.step) &&
        this.timeoutMilliseconds === null) {
        return false
      }
      return STEPS_COUNTDOWN.includes(this.step) || this.timeoutMilliseconds !== null
    },
    isDisabledBuyOrderStep () {
      return [
        BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER,
        BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_ENABLE_APPEAL_WHILE_SENDING_FIAT,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED
      ].includes(this.step)
    },
    isDisabledSellOrderStep () {
      return [
        SELL_ORDER_STEPS.SELL_ORDER_CREATED_BY_USER,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_BY_USER,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_FAILED
      ].includes(this.step)
    },
    isHiddenActionTransfer () {
      return ![
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT,
        SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER
      ].includes(this.step)
    },
    disabledButton () {
      return this.isPostTypeBuy ? this.isDisabledSellOrderStep : this.isDisabledBuyOrderStep
    },
    keyLocate () {
      let key = 'text';
      if (this.timeoutMilliseconds) {
        key += `_${SUB_KEY_DESCRIPTION_STEP.COUNTDOWN}`;
      } else {
        key += `_${SUB_KEY_DESCRIPTION_STEP.TIMEOUT}`;
      }
      if (this.hasAppeal) {
        key += `_${SUB_KEY_DESCRIPTION_STEP.CHAT}`;
      }
      return key;
    },
    isHasSubDescription () {
      return [
        BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME,
        BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_FAILED,
        BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME
      ].includes(this.step)
    },
    isPendingOrder () {
      return [ORDER_STATUS.TO_BE_PAID, ORDER_STATUS.CONFIRM_PAID, ORDER_STATUS.PAID].includes(this.order?.status)
    },
    isHasComplaintFromBuyer () {
      return [
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
        BUY_ORDER_STEPS.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED,
        SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER
      ].includes(this.step)
    },
    closeDateTime () {
      const dateTime = this.order?.appeal ? this.order?.appeal?.completedAt : ''
      return dateTime ? dayjs(dateTime).format(`HH:mm ${this.$t('datetime_unit.day')} DD/MM/YYYY`) : ''
    },
    // ==== When at list order of merchant PC and MB =====
    buttonBuyOrderStep () {
      if ([
        BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER,
        BUY_ORDER_STEPS.BUY_ENABLE_APPEAL_WHILE_SENDING_FIAT
      ].includes(this.step)) {
        return this.$t('merchant.list_order.order_item.send_vndt', {
          assetName: this.assetName
        })
      }
      if (BUY_ORDER_STEPS.BUY_SENDING_CRYPTO_FAILED === this.step) {
        return this.$t('merchant.list_order.order_item.send_vndt_again', {
          assetName: this.assetName
        })
      }
      return this.$t('merchant.list_order.order_item.send_vndt', {
        assetName: this.assetName
      })
    },
    buttonSellOrderStep () {
      return this.$t('merchant.list_order.order_item.pay')
    },
    actionTransferText () {
      return this.isPostTypeBuy ? this.buttonSellOrderStep : this.buttonBuyOrderStep
    },
    descriptionMerchant () {
      if (!this.step) {
        return ''
      }
      if (this.isSendingCryptoFailedWithTransactionUnknown) {
        return this.$t('merchant.list_order.descriptionMerchant.failed_transaction')
      }
      if (this.isHasSubDescription) {
        return this.$t(`merchant.list_order.descriptionMerchant.${this.step}.${this.keyLocate}`, {
          assetName: this.assetName
        })
      }
      return this.$t(`merchant.list_order.descriptionMerchant.${this.step}`, {
        assetName: this.assetName
      })
    },
    // ==== When open Detail order of merchant PC and MB =====
    actionTransferDetailText () {
      return this.isPostTypeBuy
        ? this.$device.isMobile ? this.$t('action.pay') : this.$t('action.pay_for_seller')
        : this.$device.isMobile ? this.$t('action.send_vndt', { assetName: this.assetName }) : this.$t('action.transfer_crypto', { assetName: this.assetName })
    },
    descriptionDetailMerchant () {
      if (!this.step) {
        return ''
      }
      if (this.isSendingCryptoFailedWithTransactionUnknown) {
        return this.$t('merchant.list_order.descriptionMerchant.failed_transaction')
      }
      if (this.isHasComplaintFromBuyer) {
        return `${this.$t(`merchant.list_order.descriptionDetailMerchant.${this.step}`, {
          assetName: this.assetName
        })} <span>${this.closeDateTime}</span>`
      }
      const keyLang = `merchant.list_order.descriptionDetailMerchant.${this.step}`
      if (this.isHasSubDescription) {
        return this.$t(`merchant.list_order.descriptionDetailMerchant.${this.step}.${this.keyLocate}`, {
          assetName: this.assetName
        })
      }
      return this.$t(keyLang, {
        assetName: this.assetName
      })
    },
    enableSubmitTx () {
      return !this.isPostTypeBuy &&
        this.order?.status === ORDER_STATUS.PAID &&
        !this.$device.isMobileOrTablet &&
        this.user?.type === USER_ROLE.MERCHANT_OPERATOR &&
        (this.isAppealReOpen || !this.isAppealOpen)
    }
  },
  methods: {
    onTermTransfer () {
      this.$emit('on-term-transfer', this.order)
    },
    onOpenAppeal () {
      this.$emit('on-open-appeal', this.order)
    },
    onOpenChat () {
      this.$emit('on-open-chat', this.order)
    },
    onTransferAction () {
      if (this.isPostTypeBuy) {
        if (this.isDisabledBuyOrderStep) {
          return
        }
        this.$emit('on-pay', this.order)
      } else {
        if (this.isDisabledSellOrderStep) {
          return
        }
        this.$emit('on-transfer', this.order)
      }
    },
    onTimeout () {
      this.$emit('on-timeout', this.order)
    }
  }
}
