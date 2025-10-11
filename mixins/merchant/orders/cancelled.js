import { ORDER_STATUS_KEY } from '@/config/constant';
import { mapActions, mapState } from 'vuex';
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
            width: '25%'
          }
        },
        {
          key: 'penaltyFee',
          label: this.$t('merchant.list_order.order_filter.penalty_fee'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '12%'
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
  computed: {
    ...mapState('statistics', ['statistics', 'cancelOrderAppeal']),
    cancelOrderCount () {
      return this.statistics?.cancelOrderCount || 0
    },
    cancelOrderAppealCount () {
      if (!this.orderLoading) {
        return this.total + this.cancelOrderAppeal
      }
      return 0
    }
  },
  methods: {
    ...mapActions('merchant-orders', ['updateOrderDetail']),
    ...mapActions('statistics', ['resetCancelOrderAppeal']),
    async $cancelledOrdersMixin_onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
    async $cancelledOrdersMixin_onResetFilter () {
      this.$cancelledOrdersMixin_onResetStateFilter()
      await this.$commonOrdersMixin_getListOrders()
    },
    $cancelledOrdersMixin_onResetStateFilter () {
      this.page = 1
      this.type = ''
      this.assetType = 0
      this.limit = 10
      this.amount = 0
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.sort = 'createdAt:desc'
      this.transferCode = ''
      this.orderGroup = ORDER_GROUPS.CANCEL
      this.orderStatus = `${ORDER_STATUS_KEY.CANCELLED}`
      this.resetCancelOrderAppeal()
    },
    async $cancelledOrdersMixin_onFilterOrder (options) {
      const { endDate, startDate, type, orderStatus, asset, searchField, searchValue } = options
      this.page = 1
      this.searchField = searchField
      this.searchValue = searchValue
      this.type = type
      this.orderStatus = orderStatus || `${ORDER_STATUS_KEY.CANCELLED}`
      this.assetType = asset
      this.startDate = startDate
      this.endDate = endDate
      await this.$commonOrdersMixin_getListOrders()
    },
    async $cancelledOrdersMixin_onSearch ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    }
  }
}
