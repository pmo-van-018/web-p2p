import { mapActions, mapState } from 'vuex'
import { ORDER_STATUS, POST_TYPE } from '@/config/constant'
import { BUY_APPEAL_RESULTS, MODAL_TYPE_CONFIRM, SELL_APPEAL_RESULTS } from '@/constants/appeals'
import dayjs from 'dayjs'
import { MODAL } from '@/resources/modal'
import { ERROR_TYPE } from '@/resources/message';

export default {
  data () {
    return {
      isDetailLoading: false,
      decisionResult: 0
    }
  },
  computed: {
    ...mapState('admin-appeal', ['detailAppeal']),
    appeal () {
      return this.detailAppeal
    },
    order () {
      return this.appeal?.order
    },
    orderAppealChat () {
      return { ...this.order, appeal: this.appeal }
    },
    status () {
      return this.order?.status
    },
    appealId () {
      return this.appeal?.id
    },
    actualCloseAt () {
      return this.appeal?.actualCloseAt
    },
    completedAt () {
      return this.appeal?.completedAt
    },
    addExtraAt () {
      return this.appeal?.addExtraAt
    },
    orderType () {
      return this.order?.type
    },
    merchantWonKey () {
      return this.orderType === POST_TYPE.SELL ? SELL_APPEAL_RESULTS.SELL_MCWIN_SUCCESS : BUY_APPEAL_RESULTS.BUY_MCWIN_CANCEL
    },
    userWonKey () {
      return this.orderType === POST_TYPE.SELL ? SELL_APPEAL_RESULTS.SELL_EUWIN_CANCEL_MC_VIOLATE : BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN
    },
    closeAppeal () {
      if (this.isForceCloseAppeal) {
        return BUY_APPEAL_RESULTS.BUY_EUWIN_FORCE_CLOSE
      }
      return this.orderType === POST_TYPE.SELL ? SELL_APPEAL_RESULTS.SELL_NOWIN_CANCEL_MC_HAS_RETURNED : BUY_APPEAL_RESULTS.BUY_NOWIN_CANCEL_EVIDENT_NOT_APPROVED
    },
    isVisibleInformation () {
      return !this.completedStatus
    },
    completedStatus () {
      return [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(this.status)
    },
    dangerClass () {
      return this.completedStatus ? 'danger' : 'warning'
    },
    appealAtText () {
      if (this.completedStatus) {
        return this.$t('admin.complaint_ended_at')
      }
      if (this.addExtraAt) {
        return this.$t('admin.complaint_added_extra')
      }
      return this.$t('admin.complaint_will_end')
    },
    appealAtDateTime () {
      const formatTemplate = `HH:mm ${this.$t('datetime_unit.day')} DD/MM/YYYY`
      if (this.completedStatus) {
        return dayjs(this.actualCloseAt).format(formatTemplate)
      }
      return dayjs(this.completedAt).format(formatTemplate)
    },
    isForceCloseAppeal () {
      return (this.appeal?.decisionAt &&
        this.appeal?.decisionResult &&
        this.appeal?.decisionResult === BUY_APPEAL_RESULTS.BUY_EUWIN_REOPEN)
    },
    isVisibleAction () {
      return this.isVisibleInformation && !this.isForceCloseAppeal
    }
  },
  async created () {
    await this.getDetailAppeal()
  },
  methods: {
    ...mapActions('admin-appeal', ['setConfirmModal', 'setExtraModal', 'onShowDetailAppeal']),
    ...mapActions('chat', ['setVisibleChat', 'setOrder']),
    ...mapActions('modal-message', ['initModal']),
    onOpenModalUserWon () {
      this.setConfirmModal({
        title: this.$t('admin.modal.title.confirm_user_win'),
        key: this.userWonKey,
        appealId: this.appealId,
        orderType: this.orderType,
        orderId: this.order.id,
        modalType: MODAL_TYPE_CONFIRM.USER_WIN
      })
      this.$bvModal.show(MODAL.CONFIRM_WINNER_APPEAL)
    },
    onOpenModalMerchantWon () {
      this.setConfirmModal({
        title: this.$t('admin.modal.title.confirm_merchant_win'),
        key: this.merchantWonKey,
        appealId: this.appealId,
        orderType: this.orderType,
        orderId: this.order.id,
        modalType: MODAL_TYPE_CONFIRM.MERCHANT_WIN
      })
      this.$bvModal.show(MODAL.CONFIRM_WINNER_APPEAL)
    },
    onOpenCloseAppeal () {
      this.setConfirmModal({
        title: this.$t('admin.modal.title.confirm_closed'),
        key: this.closeAppeal,
        orderType: this.orderType,
        orderId: this.order.id,
        appealId: this.appealId,
        modalType: this.isForceCloseAppeal ? MODAL_TYPE_CONFIRM.FORCE_CLOSE_APPEAL : MODAL_TYPE_CONFIRM.CLOSE_APPEAL
      })
      this.$bvModal.show(MODAL.CONFIRM_WINNER_APPEAL)
    },
    onOpenExtraTimeAppeal () {
      this.setExtraModal({
        title: this.$t('admin.modal.title.extra_time_appeal'),
        orderType: this.orderType,
        orderId: this.order.id,
        appealId: this.appealId
      })
      this.$bvModal.show(MODAL.EXTRA_TIME_APPEAL)
    },
    async getDetailAppeal () {
      const appealId = this.$route.query.appealId || 0
      this.isDetailLoading = true
      const res = await this.onShowDetailAppeal(appealId)
      if (res?.errors?.length) {
        this.initModal({
          type: ERROR_TYPE.MANUAL,
          message: res?.errors,
          isShow: true,
          showConnectWallet: false
        })
        this.isDetailLoading = false
        if (res.errors[0].key === 'ADMIN_SUPPORTER_VIEW_APPEAL_PERMISSION_DENIED') {
          this.$router.replace('/admin-supporter/list-appeals')
        }
      }
      this.isDetailLoading = false
      this.setOrder(this.orderAppealChat)
      this.setVisibleChat(true)
    }
  }
}
