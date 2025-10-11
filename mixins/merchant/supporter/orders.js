import { MODAL } from '@/resources/modal';
import { POST_TYPE } from '@/config/constant';
import MERCHANT_ORDER_API from '@/api/merchant-order';
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message';
import { mapActions, mapState } from 'vuex'
import { isKeepPopupOptionsLocalStorage } from '@/helper';
export default {
  data () {
    return {
      POST_TYPE,
      modalAppeal: MODAL.MERCHANT_APPEAL,
      selectedOrder: {},
      rowOrderSelected: null,
      isOpenDetail: false,
      isLoadingConfirmResolved: false
    }
  },
  computed: {
    ...mapState('chat', ['lastMessages', 'isListenerEventSocket']),
    ordersMapped () {
      const filterAllOrders = this.orders?.map((item) => {
        return {
          ...item,
          _showDetails: item.orderId === this.detailsRow?.orderId ? this.detailsRow?._showDetails : false
        }
      })
      return filterAllOrders.map((order, index) => {
        const lastMessage = this.lastMessages.find(message => order?.roomId === message.roomId)
        return {
          ...order,
          isSeenMessage: lastMessage ? lastMessage?.seen : true,
          _rowVariant: index === 0 ? 'warning' : undefined
        }
      })
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('chat', ['setOrder', 'setVisibleChat', 'setListenerEventSocket']),
    $_supporterMixin_toggleDetails (item) {
      if (this.detailsRow && this.detailsRow !== item) {
        this.detailsRow._showDetails = false
        this.setVisibleChat(false)
      }
      this.selectedOrder = item
      this.$set(item, '_showDetails', !item._showDetails)
      this.detailsRow = item
      this.setOrder(item)
      if (this.isListenerEventSocket) {
        this.setListenerEventSocket(false)
      }
    },
    $_supporterMixin_openAppealPopup (item) {
      this.rowOrderSelected = item // using toggle row detail
      this.isOpenDetail = false
      this.selectedOrder = { ...item, isSupporter: true }
      if (isKeepPopupOptionsLocalStorage(MODAL.MERCHANT_APPEAL, item.type)) {
        this.$bvModal.show(MODAL.MERCHANT_APPEAL)
      } else {
        this.$emit('on-open-chat', item)
      }
    },
    $_supporterMixin_openAppealPopupFromDetailPopup () {
      this.$bvModal.hide(MODAL.ORDER_DETAIL)
      this.$bvModal.show(MODAL.MERCHANT_APPEAL)
    },
    handleChangeSort ({ sortField, sortDirection }) {
      this.sortField = sortField
      this.sortDirection = sortDirection
    },
    formatNickName (nickName) {
      return nickName.substring(0, 20) + (nickName.length > 20 ? '...' : '')
    },
    openChatFrameInAppealModal (order) {
      if (!this.isVisibleChat) {
        this.setOrder(order)
        this.setVisibleChat(true)
        this.setListenerEventSocket(false)
        this.$bvModal.show(MODAL.CHAT_FRAME)
      }
    },
    async pickOrder (id) {
      try {
        const res = await this.$axios.$put(MERCHANT_ORDER_API.SUPPORTER_PICK(id));
        if (res?.errors?.length) {
          this.handleError(res?.errors[0]?.key)
          return
        }
        this.$emit('pick-order')
        this.countPickedOrder()
      } catch (e) {
        const keyError = e.response?.data?.errors[0]?.key || 'error_system'
        this.handleError(keyError)
      }
    },
    async resolveAppeal (id) {
      try {
        this.isLoadingConfirmResolved = true
        const res = await this.$axios.$put(MERCHANT_ORDER_API.SUPPORTER_RESOLVE(id));
        if (res?.errors?.length) {
          this.handleError(res?.errors[0]?.key)
          return
        }
        this.$emit('on-refresh')
      } catch (e) {
        const keyError = e.response?.data?.errors[0]?.key
        this.handleError(keyError)
      } finally {
        this.isLoadingConfirmResolved = false
      }
    },
    async countPickedOrder () {
      try {
        const { data } = await this.$axios.$get(MERCHANT_ORDER_API.SUPPORTER_COUNT_PICKED_ORDER)
        this.totalPicked = data?.total || 0
      } catch (e) {
        console.error(e)
      }
    },
    openOrderDetail (item) {
      this.selectedOrder = { ...item, isSupporter: true }
      this.$bvModal.show(MODAL.ORDER_DETAIL)
    },
    handleError (keyError) {
      const modalConfig = {
        title: this.$t('modal.title.system'),
        description: this.$t(`modal.message.${keyError}`),
        content: '',
        show: true
      };
      switch (keyError) {
        case 'TOTAL_ORDER_SUPPORT_LIMITS_ARE_EXCEEDED':
          modalConfig.description = this.$t(`modal.message.${keyError}`, {
            count: this.appealReceivedBySupporterLimit
          });
          modalConfig.icon = RESPONSE_ICON.NOT_ALLOWED_APPEAL;
          modalConfig.confirmAction = this.$t('action.confirm');
          modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
          break;
        default:
          modalConfig.icon = RESPONSE_ICON.RESPONSE_FAILED;
          break;
      }

      this.showResponseModal(modalConfig);
    }
  }
}
