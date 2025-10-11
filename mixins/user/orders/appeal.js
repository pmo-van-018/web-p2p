import { STATUS_PENDING_ORDER } from '@/resources/merchant/orders-filter';
import commonOrdersMixin from '@/mixins/user/orders/common';
import { ORDER_GROUPS } from '@/resources/order-filters';
export default {
  mixins: [commonOrdersMixin],
  data () {
    return {
      fields: [
        {
          key: 'type',
          label: this.$t('user_orders.list_type'),
          subLabel: this.$t('user_orders.asset_type'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '11%'
          }
        },
        {
          key: 'id',
          label: this.$t('user_orders.code_command'),
          subLabel: this.$t('user_orders.list_status'),
          sortField: 'id',
          isSort: true,
          thStyle: {
            width: '11%'
          }
        },
        {
          key: 'amount',
          label: this.$t('user_orders.amount'),
          subLabel: this.$t('user_orders.amount_mobile'),
          sortField: 'amount',
          isSort: true
        },
        {
          key: 'content',
          label: this.$t('user_orders.transaction_info'),
          subLabel: '',
          sortField: '',
          isSort: false
        },
        {
          key: 'progressing',
          label: this.$t('user_orders.process-label'),
          subLabel: '',
          sortField: '',
          isSort: false
        },
        {
          key: 'actions',
          label: '',
          subLabel: '',
          sortField: '',
          isSort: false
        }
      ]
    }
  },
  methods: {
    async $appealOrdersMixin_onResetFilter () {
      this.$appealOrdersMixin_onResetStateFilter()
      await this.$commonOrdersMixin_getListOrders()
    },
    $appealOrdersMixin_onResetStateFilter () {
      this.page = 1
      this.type = ''
      this.assetType = 0
      this.limit = 10
      this.amount = 0
      this.search = ''
      this.endDate = ''
      this.startDate = ''
      this.transferCode = ''
      this.orderGroup = ORDER_GROUPS.APPEAL
      this.orderStatus = STATUS_PENDING_ORDER
    },
    async $appealOrdersMixin_onFilterOrder (options) {
      const { asset, orderStatus, type, search } = options
      this.type = type
      this.orderStatus = orderStatus || STATUS_PENDING_ORDER
      this.assetType = asset
      this.search = search
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    }
  }
}
