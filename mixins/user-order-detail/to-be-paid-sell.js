import { ORDER_SELL_STEP, ORDER_ACTIONS } from '@/resources/transfer-to-seller/index.js';
import { BANK } from '@/resources/bank.js';
import stepMercyTimeoutMixin from '@/mixins/user-order-detail/step-mercy-timeout';
import { TRANSACTION_STATUS } from '@/constants/transaction';
import { SEND_CRYPTO_STATUS } from '@/resources/send-crypto';
import { mapActions } from 'vuex';
import { MODAL } from '@/resources/modal';

export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [stepMercyTimeoutMixin],
  data () {
    return {
      currentTime: 0,
      isRequestConfirmLoading: false
    }
  },
  computed: {
    isSellSendingCryptoByUser () {
      return this.order?.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name
    },
    isSellSendingCryptoFailed () {
      return [TRANSACTION_STATUS.FAILED, TRANSACTION_STATUS.UNKNOWN].includes(this.lastTransaction?.status)
    },
    isSellSendingCryptoPending () {
      return TRANSACTION_STATUS.PENDING === this.lastTransaction?.status
    },
    isSellSendingCryptoUnknown () {
      return TRANSACTION_STATUS.UNKNOWN === this.lastTransaction?.status
    },
    title () {
      return this.isSellSendingCryptoUnknown ? this.$t('end_user_sell.unknown_transfer') : this.$t('end_user_sell.note.transfer_info.countdown_text')
    },
    subTitle () {
      return this.isSellSendingCryptoUnknown ? this.$t('end_user_sell.unknown_description') : ''
    },
    titleMobile () {
      return this.isSellSendingCryptoUnknown ? this.$t('end_user_sell.unknown_transfer') : this.$t('action.transfer_crypto', { assetName: this.order?.assetName })
    },
    subTitleMobile () {
      return this.isSellSendingCryptoUnknown ? this.$t('end_user_sell.unknown_description') : this.$t('end_user_sell.note.transfer_info.countdown_text')
    },
    timeLeft () {
      if (this.isSellSendingCryptoUnknown) {
        return null
      }
      const timeDown = this.order?.timeout || 0
      if (!this.order || !timeDown) {
        return 0
      }
      return this.$options.filters.convertToMilliseconds(timeDown)
    },
    lastTransaction () {
      return this.order?.transactions?.length
        ? this.order?.transactions[this.order?.transactions?.length - 1]
        : {}
    },
    transactionStatus () {
      return SEND_CRYPTO_STATUS.FAILED
    },
    listInfo () {
      return [
        {
          title: this.$t('label.bank_name'),
          value: BANK.find(e => e.bankName === this.order?.bankName)?.name || '',
          icon: BANK.find(e => e.bankName === this.order?.bankName)?.icon || ''
        },
        {
          title: this.$t('label.bank_account'),
          value: this.order?.bankNumber || '',
          isVisibleEye: true,
          valueMark: this.$options.filters.formatMarkBankNumber(this.order?.bankNumber)
        },
        {
          title: this.$t('label.full_name'),
          value: this.order?.bankAccountName || '',
          valueClass: 'uppercase'
        },
        {
          title: this.$t('label.amount_money'),
          value: `${this.order?.fiatSymbol || ''} ${this.$options.filters.formatMoney(this.order?.totalPrice || 0)}`,
          valueCopy: this.order?.totalPrice || ''
        },
        {
          title: this.$t('label.transfer_contents'),
          value: this.order && this.order.transCode,
          labelNote: this.$t('transfer_seller.info.note_transfer_contents_received')
        }
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        if ((this.order?.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_BY_USER.name && this.isSellSendingCryptoPending) ||
          this.order?.step === ORDER_SELL_STEP.SELL_SENDING_CRYPTO_FAILED.name) {
          const data = {
            type: ORDER_ACTIONS.SEND_CRYPTO_PROCESS,
            value: this.currentTime
          }
          this.$emit('action', data)
        }
      }, 1000)
    })
  },
  methods: {
    ...mapActions('chat', ['setOrder', 'setVisibleChat']),
    $_toBePaidSellMixin_getCurrentTime (time) {
      this.currentTime = time
    },
    $_toBePaidSellMixin_sendCrypto () {
      const data = {
        type: ORDER_ACTIONS.SEND_CRYPTO,
        value: this.currentTime === 0 ? this.timeLeft : this.currentTime
      }
      if (this.isSellSendingCryptoByUser) {
        data.type = ORDER_ACTIONS.SEND_CRYPTO_PROCESS
      }
      this.$emit('action', data)
    },
    $_toBePaidSellMixin_cancelPayment () {
      const data = {
        type: ORDER_ACTIONS.CANCEL_PAYMENT
      }
      this.$emit('action', data)
    },
    $_toBePaidSellMixin_txConfirm () {
      const data = {
        type: ORDER_ACTIONS.TX_CONFIRM
      }
      this.$emit('action', data)
    },
    $_toBePaidSellMixin_contactAdmin () {
      this.$bvModal.show(MODAL.APPEAL)
    }
  }
}
