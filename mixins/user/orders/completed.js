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
          isSort: true,
          thStyle: {
            width: '17%'
          }
        },
        {
          key: 'content',
          label: this.$t('user_orders.transaction_info'),
          subLabel: '',
          sortField: '',
          isSort: false
        },
        {
          key: 'completedTime',
          label: this.$t('user_orders.completed-time'),
          subLabel: '',
          sortField: '',
          isSort: false
        },
        {
          key: 'status',
          label: this.$t('user_orders.list_status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'actions',
          label: '',
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        }
      ]
    }
  },
  methods: {
    async $completedOrdersMixin_onResetFilter () {
      this.$completedOrdersMixin_onResetStateFilter()
      await this.$commonOrdersMixin_getListOrders()
    },
    $completedOrdersMixin_onResetStateFilter () {
      const startDate = new Date();
      const endDate = new Date();
      startDate.setDate(startDate.getDate() - 31)
      this.page = 1
      this.type = ''
      this.assetType = 0
      this.limit = 10
      this.amount = 0
      this.searchField = ''
      this.searchValue = ''
      this.endDate = endDate
      this.startDate = startDate
      this.sort = 'createdAt:desc'
      this.orderField = ''
      this.orderDirection = ''
      this.orderStatus = `${ORDER_STATUS_KEY.COMPLETED}`
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
