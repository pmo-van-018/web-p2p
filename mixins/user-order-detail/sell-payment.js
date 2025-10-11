import { ORDER_ACTIONS, STATUS_ORDER_SELL } from '@/resources/transfer-to-seller/index.js';
import { BANK } from '@/resources/bank.js';
import { SELL_ORDER_STEPS } from '@/constants/orders.js';
import ORDER_API from '@/api/user-order'
import { getDurationWithUnit } from '@/helper/datetime';
import { FULL_DATE_FORMAT } from '@/config/constant';
import { mapActions } from 'vuex'
import { MODAL } from '@/resources/modal'
import { isKeepPopupOptionsLocalStorage } from '@/helper';
import dayjs from 'dayjs'
import stepMercyTimeoutMixin from '@/mixins/user-order-detail/step-mercy-timeout';

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
      isContactAdmin: false,
      appealId: '',
      appealEndTime: '',
      isLoading: false
    }
  },
  mounted () {
    this.appealId = this.order?.appeal?.appealId
  },
  computed: {
    paymentMethodTitle () {
      if ([
        SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME,
        SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT,
        SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER
      ].includes(this.order?.step)) {
        return this.$t('transfer_seller.completed.label.payment_method_title')
      }
      return this.$t('transfer_seller.waiting.label.payment_methods')
    },
    isPaidOrder () {
      return (
        this.order?.status === STATUS_ORDER_SELL.PAID.upercaseName &&
          [
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS,
            SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
          ].includes(this.order?.step)
      )
    },
    isEnableContactAdmin () {
      return this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME && !this.timeLeft
    },
    isUserSendSuccess () {
      return this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS
    },
    isAppealing () {
      return this.order?.step === SELL_ORDER_STEPS.SELL_APPEAL_SENT_FIAT_NOT_RECEIVED_BY_USER
    },
    isEnableAppealSentFiatByMerchant () {
      return this.order?.step === SELL_ORDER_STEPS.SELL_ENABLE_APPEAL_NOTIFY_SENT_FIAT_BY_MERCHANT
    },
    contactText () {
      return this.isEnableAppealSentFiatByMerchant
        ? this.$t('end_user_sell.waiting.label.contact_admin')
        : this.$t('end_user_sell.waiting.label.contact_buyer')
    },
    timeLeft () {
      if (this.order?.timeout === null || this.appealEndTime) {
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
    appealLimitText () {
      if (this.isAppealing) {
        const { unit, durations } = getDurationWithUnit(
          this.order?.appeal?.openAt,
          this.order?.appeal?.completedAt
        );
        this.appealEndTime = dayjs(this.order?.appeal?.completedAt).format(FULL_DATE_FORMAT)
        return this.$t('appeal.title', {
          durations,
          unit: this.$t(`datetime_unit.${unit}`)
        })
      }
      return ''
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
  methods: {
    ...mapActions('chat', ['setOrder', 'setVisibleChat']),
    ...mapActions('end-user', ['setBuyInfo']),
    openChatFrame () {
      this.setOrder(this.order)
      this.$bvModal.show(MODAL.CHAT_FRAME)
      this.setVisibleChat(true)
    },
    $_sellPaymentMixin_getCurrentTime (time) {
      this.currentTime = time
    },
    $_sellPaymentMixin_onTimeOut () {
      if (this.order?.step === SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME) {
        this.setBuyInfo({
          ...this.order,
          timeout: null
        })
      }
    },
    $_sellPaymentMixin_submitPayment () {
      const data = {
        type: ORDER_ACTIONS.SELL_CONFIRM_PAYMENT,
        value: this.currentTime
      }
      this.$emit('action', data)
    },
    async checkStatusToContact () {
      if (this.isEnableAppealSentFiatByMerchant) {
        await this.contactAdmin()
        return
      }
      await this.getAppealGroup()
    },
    async getAppealGroup () {
      this.isContactAdmin = false
      if (!this.appealId && !this.order?.appeal) {
        await this.$_sellPaymentMixin_requestAppeal()
      }
      if (isKeepPopupOptionsLocalStorage('modalAppeal', this.order?.type)) {
        this.$bvModal.show('modalAppeal')
      } else {
        this.openChatFrame()
      }
    },
    contactAdmin () {
      this.isContactAdmin = true
      this.$bvModal.show('modalAppeal')
    },
    async $_sellPaymentMixin_requestAppeal () {
      this.isLoading = true
      try {
        const result = await this.$axios.$post(ORDER_API.SELL_APPEAL, {
          id: this.order?.id
        });
        if (result?.data) {
          this.appealId = result.data.appealId
        }
        return result;
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    }
  }
}
