import { ORDER_STATUS_KEY } from '@/config/constant';
import commonOrdersMixin from '@/mixins/user/orders/common';

export default {
  mixins: [commonOrdersMixin],
  data () {
    return {
      fields: [
        {
          key: 'type',
          label: this.$t('user_orders.asset_type'),
          subLabel: this.$t('user_orders.code_command'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '20%'
          }
        },
        {
          key: 'amount',
          label: this.$t('user_orders.amount'),
          subLabel: this.$t('user_orders.amount_mobile'),
          sortField: 'totalPrice',
          isSort: true
        },
        {
          key: 'status',
          label: this.$t('user_orders.list_status'),
          subLabel: '',
          sortField: '',
          isSort: false
        }
      ],
      cancelOrderCount: 0,
      hasAppeal: false
    }
  },
  methods: {
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
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.hasAppeal = true
      this.transferCode = ''
      this.orderField = ''
      this.orderDirection = ''
      this.orderStatus = `${ORDER_STATUS_KEY.CANCELLED}`
    },
    async $cancelledOrdersMixin_onFilterOrder (options) {
      const { endDate, startDate, type, orderStatus, asset, search } = options
      this.page = 1
      this.search = search
      this.type = type
      this.orderStatus = orderStatus || `${ORDER_STATUS_KEY.CANCELLED}`
      this.assetType = asset
      this.startDate = startDate
      this.endDate = endDate
      await this.$commonOrdersMixin_getListOrders()
    },
    async $cancelledOrdersMixin_onSearch (search) {
      this.search = search
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    }
  }
}
