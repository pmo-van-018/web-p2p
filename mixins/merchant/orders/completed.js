import { ORDER_STATUS_KEY } from '@/config/constant';
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
            width: '22%'
          }
        },
        {
          key: 'amount',
          label: this.$t('merchant.list_order.order_filter.money'),
          subLabel: this.$t('merchant.list_order.order_filter.crypto_money'),
          sortField: 'totalPrice',
          isSort: true,
          thStyle: {
            width: '17%'
          }
        },
        {
          key: 'content',
          label: this.$t('merchant.list_order.order_filter.transfer_code'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '19%'
          }
        },
        {
          key: 'completedTime',
          label: this.$t('user_orders.completed-time'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '19%'
          }
        },
        {
          key: 'status',
          label: this.$t('merchant.list_order.order_filter.status'),
          subLabel: '',
          sortField: '',
          isSort: false
        },
        {
          key: 'term',
          label: '',
          subLabel: '',
          sortField: '',
          isSort: false
        }
      ]
    }
  },
  methods: {
    ...mapActions('merchant-orders', ['updateOrderDetail']),
    async $completedOrdersMixin_onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
    async $completedOrdersMixin_onResetFilter () {
      this.$completedOrdersMixin_onResetStateFilter()
      await this.$commonOrdersMixin_getListOrders()
    },
    $completedOrdersMixin_onResetStateFilter () {
      this.page = 1
      this.type = ''
      this.assetType = 0
      this.limit = 10
      this.amount = 0
      this.endDate = ''
      this.searchField = ''
      this.searchValue = ''
      this.startDate = ''
      this.sort = 'createdAt:desc'
      this.transferCode = ''
      this.orderGroup = ORDER_GROUPS.SUCCESS
      this.orderStatus = `${ORDER_STATUS_KEY.COMPLETED}`
    },
    async $completedOrdersMixin_onSearch ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
    async $completedOrdersMixin_onFilterOrder (options) {
      const { endDate, startDate, type, orderStatus, asset, searchField, searchValue } = options
      this.page = 1
      this.searchField = searchField
      this.searchValue = searchValue
      this.type = type
      this.orderStatus = orderStatus || `${ORDER_STATUS_KEY.COMPLETED}`
      this.assetType = asset
      this.startDate = startDate
      this.endDate = endDate
      await this.$commonOrdersMixin_getListOrders()
    }
  }
}
