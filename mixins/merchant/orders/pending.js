import { STATUS_PENDING_ORDER } from '@/resources/merchant/orders-filter';
import { ORDER_GROUPS } from '@/resources/order-filters';
import { ORDER_STATUS } from '@/config/constant';
import { mapActions, mapState } from 'vuex'
import commonOrdersMixin from '@/mixins/merchant/orders/common';
export default {
  mixins: [commonOrdersMixin],
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
          key: 'status',
          label: this.$t('merchant.list_order.order_filter.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'amount',
          label: this.$t('merchant.list_order.order_filter.money'),
          subLabel: this.$t('merchant.list_order.order_filter.crypto_money'),
          sortField: 'totalPrice',
          isSort: true
        },
        {
          key: 'bank',
          label: this.$t('merchant.list_order.order_filter.bank_number'),
          subLabel: this.$t('merchant.list_order.order_filter.transfer_code'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'userInfo',
          label: this.$t('merchant.list_order.order_filter.merchant'),
          subLabel: this.$t('merchant.list_order.order_filter.user'),
          sortField: '',
          isSort: false
        },
        {
          key: 'supporterProcessing',
          label: this.$t('merchant.list_order.order_table.supporter_process'),
          subLabel: '',
          sortField: '',
          thStyle: {
            width: '12%'
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
          isSort: false,
          thStyle: {
            width: '17%'
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('chat', ['lastMessages']),
    orders () {
      const filterAllOrders = this.orderMapped?.filter(item => ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED]
        .includes(item.status))
        .map((item) => {
          return {
            ...item,
            _showDetails: item.orderId === this.rowOrderSelected?.orderId ? this.rowOrderSelected?._showDetails : false
          }
        })
      return filterAllOrders?.map((order, index) => {
        const lastMessage = this.lastMessages.find(message => order?.roomId === message.roomId)
        return {
          ...order,
          isSeenMessage: lastMessage?.seen || false,
          _rowVariant: index === 0 ? 'warning' : undefined
        }
      })
    }
  },
  methods: {
    ...mapActions('merchant-orders', ['updateOrderDetail']),
    async $pendingOrdersMixin_onRefresh () {
      await this.$commonOrdersMixin_getListOrders()
    },
    async $pendingOrdersMixin_onResetFilter () {
      this.$pendingOrdersMixin_onResetStateFilter()
      await this.$commonOrdersMixin_getListOrders()
    },
    $pendingOrdersMixin_onResetStateFilter () {
      this.type = ''
      this.assetType = 0
      this.amount = 0
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.sort = ''
      this.transferCode = ''
      this.supporterId = ''
      this.limit = Number(this.$config.LIMIT_ORDERS_SHOW_ALL) || 10
      this.orderGroup = ORDER_GROUPS.WAITING
      this.orderStatus = STATUS_PENDING_ORDER
    },
    async $pendingOrdersMixin_onSearch ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      await this.$commonOrdersMixin_getListOrders()
    },
    $pendingOrdersMixin_updateTotalPendingOrder (order) {
      if (order && [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(order.status)) {
        this.totalPendingOrder = this.totalPendingOrder > 0 ? this.totalPendingOrder - 1 : 0
        this.$emit('update-total-pending', this.totalPendingOrder)
      }
    },
    async $pendingOrdersMixin_onFilterOrder (options) {
      const { asset, orderStatus, type, search, supporterId } = options
      this.type = type
      this.orderStatus = orderStatus || STATUS_PENDING_ORDER
      this.assetType = asset
      this.search = search
      this.page = 1
      this.supporterId = supporterId
      await this.$commonOrdersMixin_getListOrders()
    }
  }
}
