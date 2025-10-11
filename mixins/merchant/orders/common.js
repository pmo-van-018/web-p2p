import MERCHANT_ORDER_API from '@/api/merchant-order';
import { ORDER_GROUPS, BUY_ORDER_GROUPS, SELL_ORDER_GROUPS } from '@/resources/order-filters';
import { DATE_TIME_FORMAT, ORDER_STATUS, POST_TYPE, USER_ROLE } from '@/config/constant';
import { mapActions, mapState } from 'vuex';
import { MODAL } from '@/resources/modal';
import dayjs from 'dayjs';
import {
  getTotalPage,
  mergeByProp,
  isKeepPopupOptionsLocalStorage,
  removeItemInPopupOptionsLocalStorage
} from '@/helper';
import walletMixin from '@/mixins/open-wallet.js'
import { ORDER_TYPE } from '@/resources/order-type'
import debounce from 'lodash/debounce'
import { BUY_ORDER_STEPS, ORDER_FIELD_SEARCH_DEFAULT, SELL_ORDER_STEPS } from '@/constants/orders'
import last from 'lodash/last';
import { TRANSACTION_STATUS } from '@/constants/transaction';
import actionAppealMixin from '~/mixins/merchant/orders/action-appeal'

export default {
  props: {
    isOpenDetailOrder: {
      type: Boolean,
      default: false
    }
  },
  mixins: [walletMixin, actionAppealMixin],
  data () {
    return {
      isSkeletonLoading: true,
      listOrder: [],
      page: 1,
      totalPages: 0,
      type: '',
      assetType: 0,
      limit: 10,
      total: 10,
      amount: 0,
      searchField: '',
      searchValue: '',
      endDate: '',
      startDate: '',
      sort: 'createdAt:asc',
      transferCode: '',
      orderLoading: false,
      orderStatus: '',
      orderDetailLoading: false,
      orderGroup: ORDER_GROUPS.WAITING,
      bankQrCode: '',
      supporterId: '',
      rowOrderSelected: null,
      ORDER_FIELD_SEARCH_DEFAULT
    }
  },
  computed: {
    ...mapState('merchant-orders', ['orderDetail', 'isPaymentFromAnotherAccount']),
    ...mapState('user', ['user']),
    ...mapState('chat', ['isVisibleChat', 'messageSeen']),
    ...mapState('payments', ['selectedPayment']),
    ...mapState({
      currentOrder: state => state.orders.order
    }),
    fieldsCustomRolesUser () {
      let fields = this.fields
      if (this.viewOnly) {
        fields = this.fields.map((e) => {
          if (e.key === 'userInfo') {
            e.label = ''
          }
          return e
        })
      }
      return fields.filter((item) => {
        return !(this.userType !== USER_ROLE.MERCHANT_MANAGER && item.key === 'userInfo') &&
        !(this.viewOnly && item.key === 'actions') &&
        !(this.viewOnly && item.key === 'statusAppeal')
      })
    },
    viewOnly () {
      return (
        this.userType === USER_ROLE.MERCHANT_MANAGER &&
        this.$route.name === 'merchant-manager-staffs-id-appeal-orders'
      )
    },
    idOfStaff () {
      if (this.userType === USER_ROLE.MERCHANT_MANAGER) {
        return this.$route.params?.id || null
      }
      return null
    },
    userType () {
      return this.user?.type || ''
    },
    lastTransactionsOrderDetail () {
      return last(this.orderDetail?.transactions) || []
    },
    lastTransactionsOrderDetailTxnStatus () {
      return this.lastTransactionsOrderDetail?.txnStatus || []
    },
    isShowModalTransactionRpc () {
      return [
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS,
        SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
      ].includes(this.orderDetail?.step) &&
        !this.lastTransactionsOrderDetailTxnStatus.every((item) => {
          return item.status === TRANSACTION_STATUS.SUCCEED
        })
    },
    orderMapped () {
      return this.listOrder?.map((item) => {
        return this.hasGroupOrder(item) ? item : null
      }).filter(item => item && ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(item.status))
    },
    roomIds () {
      return this.orderMapped?.map(order => order?.roomId).filter(id => id) || []
    }
  },
  watch: {
    currentOrder: {
      handler (order) {
        if (order) {
          if (this.hasGroupOrder(order)) {
            if (this.listOrder.length === 0) {
              this.listOrder = [order]
            } else if (this.listOrder.find(e => e.orderId === order.orderId)) {
              this.listOrder = this.listOrder.map(e => e.orderId === order.orderId ? order : e)
            } else {
              this.listOrder.push(order)
            }
          } else {
            this.listOrder = this.listOrder.filter(e => e.orderId !== order.orderId)
          }
          if (this.orderGroup === ORDER_GROUPS.WAITING) {
            this.$emit('update-total-pending', this.listOrder.length)
          }
        }
      }
    },
    isOpenDetailOrder: {
      async handler (isOpen) {
        if (isOpen) {
          await this.$commonOrderMixin_openDetails(this.orderDetail)
          if (this.rowOrderSelected?._showDetails) {
            if (!this.isVisibleChat) {
              this.setVisibleChat(true)
            }
            this.$emit('on-open-detail-order', true)
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('merchant-orders', ['updateOrderDetail', 'setPaymentFromAnotherAccount']),
    ...mapActions('send-crypto', ['setConfirm']),
    ...mapActions('chat', ['setOrder', 'setVisibleChat', 'setListenerEventSocket']),
    ...mapActions('payments', ['setSelectedPayment', 'setShowSelectBank']),
    hasGroupOrder (order) {
      if (![USER_ROLE.USER, USER_ROLE.MERCHANT_OPERATOR, USER_ROLE.MERCHANT_MANAGER].includes(this.userType)) {
        return false
      }
      if (order.status === ORDER_STATUS.CANCELLED) {
        return false
      }
      const orderGroupType = order.postType === POST_TYPE.SELL ? BUY_ORDER_GROUPS : SELL_ORDER_GROUPS
      return orderGroupType[this.userType][this.orderGroup.toUpperCase()]?.includes(order.step)
    },
    $commonOrderMixin_closeDetail (item) {
      if (this.detailsRow) {
        this.detailsRow._showDetails = false
      }
      this.$set(item, '_showDetails', false)
    },
    async $commonOrderMixin_openDetails (item) {
      if (!item._showDetails) {
        await this.$commonOrdersMixin_getOrderDetail({ type: item.type, id: item.orderRefId, viewOnly: this.viewOnly })
        this.setOrder(this.orderDetail)
        this.setListenerEventSocket(false)
      }
      if (this.detailsRow && this.detailsRow !== item) {
        this.detailsRow._showDetails = false
      }
      this.rowOrderSelected = item
      this.detailsRow = item
      this.$emit('on-open-detail-order', !item._showDetails)
      this.$set(item, '_showDetails', !item._showDetails)
    },
    $commonOrderMixin_onTimeOutOrder (order) {
      const newOrders = this.listOrder.map((item) => {
        if (item.orderId === order.orderId) {
          return {
            ...item,
            timeout: [
              BUY_ORDER_STEPS.BUY_CONFIRMED_FIAT_BY_MERCHANT_DEAL_TIME,
              BUY_ORDER_STEPS.BUY_APPEAL_SENT_WHILE_CONFIRMING_FIAT_BY_MERCHANT,
              SELL_ORDER_STEPS.SELL_SENDING_CRYPTO_SUCCESS_DEAL_TIME
            ].includes(item.step) ? null : 0
          }
        }
        return item
      })
      this.listOrder = newOrders
    },
    $commonOrderMixin_onSearch: debounce(function ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      this.$commonOrdersMixin_getListOrders()
    }, 500),
    async $commonOrderMixin_handleChangeSort ({ sortField, sortDirection }) {
      this.orderField = sortField
      this.orderDirection = sortDirection
      await this.$commonOrdersMixin_getListOrders()
    },
    async $commonOrderMixin_onChangePage ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.$commonOrdersMixin_getListOrders()
    },
    async $commonOrdersMixin_onInfiniteLoadingOrder () {
      if (!this.isLoading && this.page < this.totalPages) {
        this.page = this.page + 1
        await this.$commonOrdersMixin_getListOrders(true)
      }
    },
    params () {
      const filter = {}
      this.sort && (filter.sort = this.sort)
      this.page && (filter.page = this.page)
      this.type && (filter.type = this.type)
      this.orderField && this.orderDirection && (filter.sort = `${this.orderField}:${this.orderDirection}${filter.sort ? `,${filter.sort}` : ''}`)
      this.limit && (filter.limit = this.limit)
      this.searchField && (filter.searchField = this.searchField)
      this.searchValue && (filter.searchValue = this.searchValue)
      this.assetType && (filter.assetType = this.assetType)
      this.orderStatus && (filter.orderStatus = this.orderStatus)
      this.idOfStaff && (filter.merchantId = this.idOfStaff)
      this.transferCode && (filter.transferCode = this.transferCode)
      this.endDate && (filter.endDate = dayjs(this.endDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      this.startDate && (filter.startDate = dayjs(this.startDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      filter.orderGroup = this.orderGroup || ORDER_GROUPS.WAITING
      this.supporterId && (filter.supporterId = this.supporterId)
      return filter
    },
    async $commonOrdersMixin_getListOrders (isMerged = false) {
      try {
        this.orderLoading = true
        const res = await this.$axios.$get(MERCHANT_ORDER_API.GET_LIST_ORDER, { params: this.params() })
        if (res?.data) {
          if (isMerged) {
            this.listOrder = mergeByProp(this.listOrder, res.data.orders, 'orderId')
          } else {
            this.listOrder = res.data.orders
          }
          this.total = res.data.total
          const totalPages = getTotalPage(res.data.total, this.limit)
          this.totalPages = totalPages
          if (this.orderGroup === ORDER_GROUPS.WAITING) {
            this.$emit('update-total-pending', this.total)
          }
        }
        this.orderLoading = false
      } catch (error) {
        this.orderLoading = false
      }
    },
    async $commonOrdersMixin_getOrderDetail ({ type, id, viewOnly }) {
      try {
        this.orderDetailLoading = true
        if (!viewOnly) {
          viewOnly = false
        }
        const apiPath = type === ORDER_TYPE.BUY ? MERCHANT_ORDER_API.BUY_INFO(id, viewOnly) : MERCHANT_ORDER_API.SELL_INFO(id, viewOnly)
        const res = await this.$axios.$get(apiPath)
        if (res?.data) {
          this.updateOrderDetail(res.data)
        }
        this.orderDetailLoading = false
        return res.data
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error)
        this.orderDetailLoading = false
      }
    },
    async $commonOrdersMixin_onFilterOptionsMobile (options) {
      const {
        amount,
        assetType,
        orderDirection,
        orderField,
        orderStatus,
        type,
        searchField,
        searchValue,
        supporterId
      } = options
      this.amount = amount
      this.assetType = assetType
      this.orderField = orderField
      this.orderDirection = orderDirection
      this.orderStatus = orderStatus
      this.type = type
      this.page = 1
      this.searchField = searchField
      this.searchValue = searchValue
      this.supporterId = supporterId
      await this.$commonOrdersMixin_getListOrders()
    },
    async $commonOrdersMixin_onOpenDetailModal (order) {
      await this.$commonOrdersMixin_getOrderDetail({ type: order.type, id: order.id })
      this.$bvModal.show(MODAL.ORDER_DETAIL)
    },
    $commonOrdersMixin_onOpenBankQrcode (order) {
      this.bankQrCode = order.bankQrCode
      this.$bvModal.show(MODAL.BANK_QRCODE)
    },
    async $commonOrdersMixin_onOpenAppealModalMobile (order) {
      this.$bvModal.hide(MODAL.ORDER_DETAIL)
      await this.$commonOrdersMixin_getOrderDetail({ type: order.type, id: order.id })
      this.$bvModal.show(MODAL.MERCHANT_APPEAL)
    },
    async $commonOrdersMixin_confirmPaid (id) {
      try {
        this.orderDetailLoading = true
        const res = await this.$axios.$put(MERCHANT_ORDER_API.CONFIRM_PAID, { id })
        return !res?.errors?.length
      } catch (error) {
        console.error(error)
      } finally {
        this.orderDetailLoading = false
      }
    },
    async $commonOrdersMixin_onConfirmSent (id) {
      try {
        removeItemInPopupOptionsLocalStorage(MODAL.TRANSACTION_RPC, this.orderDetail?.orderRefId)
        this.orderDetailLoading = true
        const payload = {
          id,
          isPaymentFromAnotherAccount: this.isPaymentFromAnotherAccount
        }
        // If payment from another account, don't need to send paymentMethodId
        if (!this.isPaymentFromAnotherAccount) {
          payload.paymentMethodId = this.selectedPayment?.id
        }
        await this.$axios.$put(MERCHANT_ORDER_API.CONFIRM_SENT, payload)
        this.setSelectedPayment(null)
      } catch (error) {
        console.error(error)
      } finally {
        this.orderDetailLoading = false
      }
    },
    async $commonOrdersMixin_onOpenModalConfirmTransfer (order) {
      await this.updateOrderDetail(order)
      if (order.status === ORDER_STATUS.PAID) {
        await this.transferCrypto(order)
      } else {
        this.$bvModal.show(MODAL.CONFIRM_ORDER)
      }
    },
    async $commonOrdersMixin_onOpenModalConfirmPaid (order) {
      const confirmed = await this.$commonOrdersMixin_confirmPaid(order.id)
      if (confirmed) {
        await this.transferCrypto(order)
      }
    },
    async $commonOrdersMixin_onOpenModalSendCrypto (order) {
      await this.updateOrderDetail(order)
      this.setPaymentFromAnotherAccount(false)
      if (this.isShowModalTransactionRpc && isKeepPopupOptionsLocalStorage(MODAL.TRANSACTION_RPC, this.orderDetail?.orderRefId)) {
        this.$bvModal.show(MODAL.TRANSACTION_RPC)
      } else {
        this.setShowSelectBank(true)
        this.$bvModal.show(MODAL.CONFIRM_PAY)
      }
    },
    async $commonOrdersMixin_onOpenModalConfirmAnotherTransfer (order) {
      this.setPaymentFromAnotherAccount(true)
      await this.updateOrderDetail(order)
      if (this.isShowModalTransactionRpc && isKeepPopupOptionsLocalStorage(MODAL.TRANSACTION_RPC, this.orderDetail?.orderRefId)) {
        this.$bvModal.show(MODAL.TRANSACTION_RPC)
      } else {
        this.setShowSelectBank(false)
        this.$bvModal.show(MODAL.CONFIRM_PAY)
      }
    },
    async $commonOrdersMixin_onContinueConfirmTransactionRpc (order) {
      await this.updateOrderDetail(order)
      this.$bvModal.show(MODAL.CONFIRM_PAY)
    },
    $commonOrdersMixin_onOpenModalOpenAppeal (order) {
      this.rowOrderSelected = order;
      this.updateOrderDetail(order)
      if (this.isShowAppealModal(order)) {
        if (isKeepPopupOptionsLocalStorage(MODAL.MERCHANT_APPEAL, order?.type)) {
          this.$bvModal.show(MODAL.MERCHANT_APPEAL)
        } else {
          this.$emit('on-open-chat', order)
        }
      } else {
        this.$bvModal.show(MODAL.MERCHANT_APPEAL)
      }
    }
  }
}
