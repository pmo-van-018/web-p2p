import { STATUS_PENDING_ORDER } from '@/resources/merchant/orders-filter';
import { mapActions } from 'vuex';
import commonOrdersMixin from '@/mixins/merchant/orders/common';
import { ORDER_GROUPS } from '@/resources/order-filters';
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
            width: '200px'
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
            width: '20%'
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
          key: 'progressing',
          label: this.$t('merchant.list_order.order_table.progressing'),
          subLabel: '',
          sortField: '',
          isSort: false
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
  methods: {
    ...mapActions('merchant-orders', ['updateOrderDetail']),
    async $waitingConfirmationOrdersMixin_onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
    async $waitingConfirmationOrdersMixin_onResetFilter () {
      this.$waitingConfirmationOrdersMixin_onResetStateFilter()
      await this.$commonOrdersMixin_getListOrders()
    },
    $waitingConfirmationOrdersMixin_onResetStateFilter () {
      this.type = ''
      this.assetType = 0
      this.amount = 0
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.sort = 'createdAt:asc'
      this.transferCode = ''
      this.limit = Number(this.$config.LIMIT_ORDERS_SHOW_ALL) || 10
      this.orderGroup = ORDER_GROUPS.WAITING_USER
      this.orderStatus = STATUS_PENDING_ORDER
    },
    async $waitingConfirmationOrdersMixin_onFilterOrder (options) {
      const { asset, orderStatus, type, searchField, searchValue } = options
      this.type = type
      this.orderStatus = orderStatus || STATUS_PENDING_ORDER
      this.assetType = asset
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    }
  }
}
