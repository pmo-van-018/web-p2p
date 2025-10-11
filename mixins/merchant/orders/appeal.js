import { STATUS_PENDING_ORDER } from '@/resources/merchant/orders-filter';
import { ORDER_GROUPS } from '@/resources/order-filters';
import { ORDER_STATUS } from '@/config/constant';
import { mapActions, mapState } from 'vuex'
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'
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
            width: '13%'
          }
        },
        {
          key: 'status',
          label: this.$t('merchant.list_order.order_filter.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'amount',
          label: this.$t('merchant.list_order.order_filter.money'),
          subLabel: this.$t('merchant.list_order.order_filter.crypto_money'),
          sortField: 'totalPrice',
          isSort: true,
          thStyle: {
            width: '13%'
          }
        },
        {
          key: 'content',
          label: this.$t('merchant.list_order.order_filter.bank_number'),
          subLabel: this.$t('merchant.list_order.order_filter.transfer_code'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '19%'
          }
        },
        {
          key: 'userInfo',
          label: this.$t('merchant.list_order.order_filter.merchant'),
          subLabel: this.$t('merchant.list_order.order_filter.user'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'supporterProcessing',
          label: this.$t('merchant.list_order.order_table.supporter_process'),
          subLabel: '',
          sortField: '',
          thStyle: {
            width: '10%'
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
          isSort: false,
          align: 'right'
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
      const ordersFiltered = this.filterSpecialAppealCases(filterAllOrders)
      return ordersFiltered.map((order) => {
        const lastMessage = this.lastMessages.find(message => order?.roomId === message.roomId)
        return {
          ...order,
          isSeenMessage: lastMessage?.seen || false
        }
      })
    }
  },
  methods: {
    ...mapActions('merchant-orders', ['updateOrderDetail']),
    async $appealOrdersMixin_onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
    async $appealOrdersMixin_onResetFilter () {
      this.$appealOrdersMixin_onResetStateFilter()
      await this.$commonOrdersMixin_getListOrders()
    },
    $appealOrdersMixin_onResetStateFilter () {
      this.type = ''
      this.assetType = 0
      this.amount = 0
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.sort = 'createdAt:asc'
      this.transferCode = ''
      this.supporterId = ''
      this.limit = Number(this.$config.LIMIT_ORDERS_SHOW_ALL) || 10
      this.orderGroup = ORDER_GROUPS.APPEAL
      this.orderStatus = STATUS_PENDING_ORDER
    },
    async $appealOrdersMixin_onFilterOrder (options) {
      const { asset, orderStatus, type, searchField, searchValue, supporterId } = options
      this.type = type
      this.orderStatus = orderStatus || STATUS_PENDING_ORDER
      this.assetType = asset
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      this.supporterId = supporterId
      await this.$commonOrdersMixin_getListOrders()
    },
    filterSpecialAppealCases (orders) {
      const specialSteps = [BUY_ORDER_STEPS.BUY_ORDER_CREATED_BY_USER_DEAL_TIME, SELL_ORDER_STEPS.SELL_NOTIFY_SENT_FIAT_BY_MERCHANT_DEAL_TIME]
      return orders.filter(item => !(!item?.appeal?.appealId && specialSteps.includes(item?.step)))
    }
  }
}
