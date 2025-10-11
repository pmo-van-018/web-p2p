import ORDER_API from '@/api/user-order'
import { mapActions } from 'vuex';
import { ORDER_BUY_STEP } from '@/resources/transfer-to-seller/index.js';
import { getDurationWithUnit } from '@/helper/datetime';
import { BUY_APPEAL_RESULTS } from '@/constants/appeals';
import { FULL_DATE_FORMAT } from '@/config/constant';
import { MODAL } from '@/resources/modal'
import { isKeepPopupOptionsLocalStorage } from '@/helper';
import dayjs from 'dayjs'

export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      currentTime: 0,
      isContactAdmin: false,
      appealId: '',
      isLoading: false,
      appealEndTime: ''
    }
  },
  async created () {
    if (!this.order?.roomId) {
      await this.fetchDataBuyInfo(this.order?.id)
    }
  },
  mounted () {
    this.appealId = this.order?.appeal?.appealId
  },
  computed: {
    isSendingCryptoFailed () {
      return this.order?.step === ORDER_BUY_STEP.BUY_SENDING_CRYPTO_FAILED.name && !this.isReopenOrder
    },
    isUserRequestSupport () {
      return this.order?.step === ORDER_BUY_STEP.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED.name && !this.isReopenOrder
    },
    isReopenSteps () {
      return [
        ORDER_BUY_STEP.BUY_APPEAL_SENT_SENDING_CRYPTO_FAILED.name,
        ORDER_BUY_STEP.BUY_SENDING_CRYPTO_FAILED.name
      ].includes(this.order?.step) && this.isReopenOrder
    },
    status () {
      return ORDER_BUY_STEP[this.order?.step].status
    },
    lastTransaction () {
      return this.order?.transactions?.length
        ? this.order?.transactions[this.order?.transactions?.length - 1]
        : {}
    },
    isReopenOrder () {
      return this.order?.appeal?.decisionResult === BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN
    },
    appealLimitText () {
      if (this.isUserRequestSupport) {
        const { unit, durations } = getDurationWithUnit(
          this.order?.appeal?.openAt,
          this.order?.appeal?.completedAt
        );
        this.appealEndTime = dayjs(this.order?.appeal?.completedAt).format(FULL_DATE_FORMAT)
        return this.$t(
          'appeal.title',
          {
            durations,
            unit: this.$t(`datetime_unit.${unit}`)
          }
        )
      }
      return ''
    },
    titleText () {
      if (this.isSendingCryptoFailed) {
        return {
          title: this.$t('transfer_seller.waiting.label.title'),
          subTitle: this.isReopenOrder
            ? this.$t('transfer_seller.end_time.label.reopen_order')
            : this.$t('transfer_seller.completed.label.sub_title_failed')
        }
      } else if (this.isUserRequestSupport) {
        return {
          title: this.$t('transfer_seller.note.transfer_requested_support.countdown_text'),
          subTitle: this.appealLimitText
        }
      } else if (this.isReopenSteps) {
        return {
          title: this.$t('transfer_seller.note.transfer_reopen.title'),
          subTitle: this.$t('transfer_seller.note.transfer_reopen.sub_title')
        }
      } else {
        return {
          title: this.$t('transfer_seller.completed.label.title'),
          subTitle: this.$t('transfer_seller.note.transfer_completed.sub_title')
        }
      }
    },
    createdTime () {
      if (!this.order || !this.order.createdTime) {
        return ''
      }
      return dayjs(this.order.createdTime).format(FULL_DATE_FORMAT)
    },
    orderId () {
      return this.order?.orderId
    }
  },
  methods: {
    ...mapActions('end-user', [
      'fetchDataBuyInfo'
    ]),
    ...mapActions('chat', ['setOrder', 'setVisibleChat']),
    openChatFrame () {
      this.setOrder(this.order)
      this.$bvModal.show(MODAL.CHAT_FRAME)
      this.setVisibleChat(true)
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
