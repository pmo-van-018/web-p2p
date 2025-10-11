import { ORDER_BUY_STEP } from '@/resources/transfer-to-seller/index.js';
import ORDER_API from '@/api/user-order'
import { APPEAL_STATUS, BUY_APPEAL_RESULTS } from '@/constants/appeals';
import { mapActions } from 'vuex'
import { MODAL } from '@/resources/modal'
import stepMercyTimeoutMixin from '@/mixins/user-order-detail/step-mercy-timeout';
import { BUY_ORDER_STEPS } from '@/constants/orders';
import { isKeepPopupOptionsLocalStorage } from '~/helper';

export default {
  data () {
    return {
      isShowSupportLink: false,
      isContactAdmin: false,
      appealId: '',
      isLoading: false
    }
  },
  mixins: [stepMercyTimeoutMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    this.appealId = this.order?.appeal?.appealId
    this.$bvModal.hide('modalPaymentCancellation')
  },
  computed: {
    isBuyEnableWhileConfirming () {
      return this.order?.step === ORDER_BUY_STEP.BUY_CONFIRMED_FIAT_BY_MERCHANT.name
    },
    isBuyEnableWhenConfirmed () {
      return this.order?.step === ORDER_BUY_STEP.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME.name
    },
    isUserRequestSupport () {
      return this.order?.step === ORDER_BUY_STEP.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED.name
    },
    timeLeft () {
      // step 8 for the appeal of the user wins
      if (this.isBuyEnableWhenConfirmed && this.order?.appeal) {
        this.isShowSupportLink = this.isBuyEnableWhenConfirmed;
        return 0;
      }
      const timeDown = this.order?.timeout || 0;
      if (!this.order || !timeDown) {
        this.isShowSupportLink = this.isBuyEnableWhenConfirmed;
        return 0;
      }
      return this.$options.filters.convertToMilliseconds(timeDown);
    },
    appealingText () {
      return this.order?.appeal?.decisionResult === BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN
        ? this.$t('transfer_seller.end_time.label.reopen_order')
        : this.$t('transfer_seller.end_time.label.time_out_contact_support')
    },
    isAppealOpen () {
      return this.order?.appeal?.status === APPEAL_STATUS.OPEN
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
    onTimeOut () {
      if (this.order?.step === BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME) {
        this.setBuyInfo({
          ...this.order,
          timeout: null
        })
      }
    },
    contactAdmin () {
      this.isContactAdmin = true
      this.$bvModal.show('modalAppeal')
    },
    async getAppealGroup () {
      try {
        this.isLoading = true
        this.isContactAdmin = false
        if (!this.appealId && !this.order?.appeal) {
          await this.$_buyPaymentMixin_requestAppeal()
        }
        this.isLoading = false
        if (isKeepPopupOptionsLocalStorage('modalAppeal', this.order?.type)) {
          this.$bvModal.show('modalAppeal')
        } else {
          this.openChatFrame()
        }
      } catch (e) {
        this.$bvModal.hide('modalAppeal')
      }
    },
    async $_buyPaymentMixin_requestAppeal () {
      this.isLoading = true
      try {
        const result = await this.$axios.$post(ORDER_API.BUY_APPEAL, {
          id: this.order?.id
        });
        if (result?.data) {
          this.appealId = result.data?.appealId
        }
        return result;
      } catch (e) {
        console.error(e)
        throw e
      } finally {
        this.isLoading = false
      }
    }
  }
};
