import { ORDER_ACTIONS, ORDER_BUY_STEP } from '@/resources/transfer-to-seller/index.js';
import { BANK } from '@/resources/bank.js';
import ORDER_API from '@/api/user-order';
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
      isContactAdmin: true,
      appealId: '',
      isLoading: false,
      unit: '',
      durations: 0
    }
  },
  mounted () {
    this.$_close_modals()
    this.appealId = this.order?.appeal?.appealId
  },
  computed: {
    isDealingWhileNotPaid () {
      return this.order?.step === ORDER_BUY_STEP.BUY_ORDER_CREATED_BY_USER_DEAL_TIME.name
    },
    isPaidDealing () {
      return this.order?.step === ORDER_BUY_STEP.BUY_NOTIFY_SENT_FIAT_BY_USER_DEAL_TIME.name
    },
    isPaidWaitingConfirm () {
      return this.order?.step === ORDER_BUY_STEP.BUY_NOTIFY_SENT_FIAT_BY_USER.name
    },
    isBuyEnableWhileSending () {
      return this.order?.step === ORDER_BUY_STEP.BUY_ENABLE_APPEAL_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name
    },
    isContactMerchant () {
      return this.isDealingWhileNotPaid || this.isPaidWaitingConfirm || this.isPaidDealing
    },
    isUserRequestSupport () {
      return this.order?.step === ORDER_BUY_STEP.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT.name
    },
    timeLeft () {
      if (this.order?.timeout === null || this.isUserRequestSupport) {
        return null
      }
      return this.$options.filters.convertToMilliseconds(this.order.timeout)
    },
    appealEndTime () {
      if (this.isUserRequestSupport) {
        const { unit, durations } = getDurationWithUnit(
          this.order?.appeal?.openAt,
          this.order?.appeal?.completedAt
        );
        this.unit = unit
        this.durations = durations
        return dayjs(this.order?.appeal?.completedAt).format(FULL_DATE_FORMAT)
      }
      return ''
    },
    listInfo () {
      return [
        {
          title: this.$t('label.bank_name'),
          value: BANK.find(e => e.bankName === this.order?.bankName)?.name || '',
          icon: BANK.find(e => e.bankName?.toLowerCase() === this.order?.bankName?.toLowerCase())?.icon || ''
        },
        {
          title: this.$t('label.bank_account'),
          value: this.order?.bankNumber || '',
          canCopy: true
        },
        {
          title: this.$t('label.full_name'),
          value: this.order?.bankAccountName || '',
          canCopy: true,
          valueClass: 'uppercase'
        },
        {
          title: this.$t('label.amount_money'),
          value: `${this.order?.fiatSymbol || ''} ${this.$options.filters.formatMoney(this.order?.totalPrice || 0)}`,
          canCopy: true,
          valueCopy: this.order?.totalPrice || ''
        },
        {
          title: this.$t('label.transfer_contents'),
          value: this.order && this.order.transCode,
          labelNote: this.$t('transfer_seller.info.note_transfer_contents'),
          canCopy: true
        }
      ]
    }
  },
  methods: {
    ...mapActions('chat', ['setOrder', 'setVisibleChat']),
    openChatFrame () {
      this.setOrder(this.order)
      this.$bvModal.show(MODAL.CHAT_FRAME)
      this.setVisibleChat(true)
    },
    $_toBePaid_getCurrentTime (time) {
      this.currentTime = time
    },
    $_toBePaid_submitPayment () {
      const data = {
        type: ORDER_ACTIONS.CONFIRM_PAYMENT,
        value: this.currentTime
      }
      this.$emit('action', data)
    },
    $_toBePaid_cancelPayment () {
      const data = {
        type: ORDER_ACTIONS.CANCEL_PAYMENT
      }
      this.$emit('action', data)
    },
    $_close_modals () {
      this.$bvModal.hide('modalPaymentCancellation')
      this.$bvModal.hide('modalPaymentConfirmation')
    },
    async getAppealGroup () {
      this.isContactAdmin = false
      if (!this.appealId && !this.order?.appeal) {
        await this.$_buyPaymentMixin_requestAppeal()
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
    async $_buyPaymentMixin_requestAppeal () {
      try {
        this.isLoading = true
        const result = await this.$axios.$post(ORDER_API.BUY_APPEAL, {
          id: this.order?.id
        });
        if (result?.data) {
          this.appealId = result.data?.appealId
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
