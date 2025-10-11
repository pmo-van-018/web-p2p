import { mapActions, mapState } from 'vuex'
import { MODAL } from '@/resources/modal';
import ADMIN_SUPPORTER_API from '@/api/admin-supporter';
import { CONFIRM_TYPE } from '@/resources/message';
import { POST_TYPE } from '@/config/constant';

export default {
  data () {
    return {
      fields: [
        {
          key: 'type',
          label: this.$t('merchant.list_order.order_filter.type'),
          subLabel: this.$t('merchant.list_order.order_filter.asset_type'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'amount',
          label: this.$t('merchant.list_order.order_filter.money'),
          subLabel: this.$t('merchant.list_order.order_filter.crypto_money'),
          sortField: 'totalPrice',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'bank',
          label: this.$t('merchant.list_order.order_filter.bank_number'),
          subLabel: this.$t('merchant.list_order.order_filter.transfer_code'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '21%'
          }
        },
        {
          key: 'progressing',
          label: this.$t('merchant.list_order.order_table.progressing'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '19%'
          }
        },
        {
          key: 'actions',
          label: this.$t('merchant.list_order.order_table.action'),
          subLabel: '',
          sortField: '',
          align: 'right',
          isSort: false
        }
      ],
      isSkeletonLoading: true,
      listOrder: [],
      page: 1,
      totalPages: 0,
      limit: 10,
      total: 10,
      orderLoading: false,
      isConfirmedTransaction: false,
      rowOrderSelected: null,
      isOpenConfirmModal: true,
      orderDetail: null
    }
  },
  computed: {
    ...mapState('chat', ['lastMessages', 'isVisibleChat', 'messageSeen']),
    ...mapState('user', ['user']),
    userType () {
      return this.user?.type || ''
    },
    roomIds () {
      return this.listOrder?.map(order => order?.roomId).filter(id => id) || []
    },
    orders () {
      return this.listOrder?.map((order, index) => {
        const lastMessage = this.lastMessages.find(message => order?.roomId === message.roomId)
        return {
          ...order,
          postType: POST_TYPE.SELL,
          _showDetails: order.orderRefId === this.rowOrderSelected?.orderRefId ? this.rowOrderSelected?._showDetails : false,
          isSeenMessage: lastMessage?.seen || false,
          _rowVariant: index === 0 ? 'warning' : undefined
        }
      })
    },
    thumbnailConfirmation () {
      return this.isOpenConfirmModal ? '/assets/images/common/confirmation/confirm.svg' : '/assets/images/common/confirmation/not-allow.svg'
    },
    titleConfirmation () {
      return this.isOpenConfirmModal ? this.$t('transaction.confirm_transfer') : this.$t('transaction.are_you_cancel')
    },
    descConfirmation () {
      return this.isOpenConfirmModal ? this.$t('transaction.please_confirm') : ''
    },
    notesConfirmation () {
      return this.isOpenConfirmModal ? [
        this.$t('transaction.note_confirm')
      ] : [
        this.$t('transaction.confirmed_cancelled'),
        this.$t('transaction.confirmed_checked')
      ]
    },
    contentSucceedModal () {
      return this.isOpenConfirmModal ? this.$t('transaction.confirmed_succeed') : this.$t('transaction.cancel_succeed')
    },
    contentFailedModal () {
      return this.isOpenConfirmModal ? this.$t('transaction.confirmed_failed') : this.$t('transaction.cancel_failed')
    }
  },
  methods: {
    ...mapActions('chat', ['setOrder', 'setVisibleChat', 'setListenerEventSocket']),
    ...mapActions('modal-response', ['showResponseModal']),
    ...mapActions('admin-support', ['countFailedTransaction']),
    $confirmationTransactionMixin_closeDetail (item) {
      if (this.detailsRow) {
        this.detailsRow._showDetails = false
      }
      this.$set(item, '_showDetails', false)
    },
    async $confirmationTransactionMixin_onOpenDetailOrderAndChat (order) {
      await this.$confirmationTransactionMixin_openDetails(order)
      if (this.rowOrderSelected?._showDetails) {
        if (!this.isVisibleChat) {
          this.setOrder(this.orderDetail)
          this.setVisibleChat(true)
        }
      }
    },
    async $confirmationTransactionMixin_openDetails (item) {
      if (!item._showDetails) {
        await this.$confirmationTransactionMixin_getOrderDetail(item.orderRefId)
        this.setOrder(this.orderDetail)
        this.setListenerEventSocket(false)
      }
      if (this.detailsRow && this.detailsRow !== item) {
        this.detailsRow._showDetails = false
      }
      this.rowOrderSelected = item
      this.detailsRow = item
      this.$set(item, '_showDetails', !item._showDetails)
    },
    async $confirmationTransactionMixin_onChangePage ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.$confirmationTransactionMixin_getFailedTransactions()
    },
    params () {
      const filter = {}
      this.page && (filter.page = this.page)
      this.limit && (filter.limit = this.limit)
      return filter
    },
    async $confirmationTransactionMixin_getFailedTransactions (isMerged = false) {
      try {
        this.orderLoading = true
        const res = await this.$axios.$get(ADMIN_SUPPORTER_API.GET_FAILED_TRANSACTION, { params: this.params() })
        if (res?.data) {
          this.listOrder = res.data.items
          this.total = res.data?.totalItems || 0
          this.totalPages = res.data?.totalPages || 0
        }
        this.orderLoading = false
      } catch (error) {
        this.orderLoading = false
      }
    },
    async $confirmationTransactionMixin_getOrderDetail (id) {
      try {
        const res = await this.$axios.$get(ADMIN_SUPPORTER_API.GET_TRANSACTION_DETAIL_ID(id))
        if (res?.data) {
          this.orderDetail = { ...res?.data, postType: POST_TYPE.SELL } || null
        }
      } catch (error) {
        console.error(error)
      }
    },
    async $confirmationTransactionMixin_onConfirm (order) {
      await this.$confirmationTransactionMixin_confirmTransaction(order.orderRefId)
    },
    async $confirmationTransactionMixin_confirmTransaction (id) {
      try {
        this.isConfirmedTransaction = true
        const res = await this.$axios.$post(ADMIN_SUPPORTER_API.CONFIRM_TRANSACTION, {
          id,
          result: this.isOpenConfirmModal ? 'SUCCESS' : 'FAIL'
        })
        if (res?.data) {
          this.handleSuccessResponse()
          this.countFailedTransaction()
          this.page = 1
          this.$confirmationTransactionMixin_getFailedTransactions()
          return;
        }
        const keyError = res?.errors[0]?.key || 'error_system'
        const description = keyError === 'ORDER_HAS_CONFIRMED' ? this.$t('transaction.description_other_confirmed') : ''
        this.handleFailedResponse(description)
      } catch (error) {
        this.handleFailedResponse(this.$t('transaction.description_other_confirmed'))
      } finally {
        this.isConfirmedTransaction = false
      }
    },
    handleSuccessResponse () {
      this.showResponseModal({
        title: this.$t('role_management.avatar.error.title'),
        content: this.contentSucceedModal,
        icon: '/assets/images/common/confirmation/success.svg',
        confirmAction: this.$t('action.close'),
        confirmActionType: CONFIRM_TYPE.CLOSE,
        type: 'success',
        show: true
      });
    },
    handleFailedResponse (description = '') {
      this.showResponseModal({
        title: this.$t('role_management.avatar.error.title'),
        content: this.contentFailedModal,
        description,
        icon: '/assets/images/common/confirmation/failed.svg',
        confirmAction: this.$t('action.close'),
        confirmActionType: CONFIRM_TYPE.CLOSE,
        show: true
      });
    },
    async $confirmationTransactionMixin_onResetFilter () {
      this.page = 1
      this.limit = 10
      await this.$confirmationTransactionMixin_getFailedTransactions()
    },
    $confirmationTransactionMixin_openConfirmedModal () {
      this.isOpenConfirmModal = true
      this.$bvModal.show(MODAL.CONFIRMATION_TRANSACTION_FAILED)
    },
    $confirmationTransactionMixin_openCancelledModal () {
      this.isOpenConfirmModal = false
      this.$bvModal.show(MODAL.CONFIRMATION_TRANSACTION_FAILED)
    }
  }
}
