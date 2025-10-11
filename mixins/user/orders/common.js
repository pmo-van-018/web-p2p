import { BUY_ORDER_GROUPS, ORDER_GROUPS, SELL_ORDER_GROUPS } from '@/resources/order-filters';
import ORDER_API from '@/api/user-order';
import debounce from 'lodash/debounce';
import { DATE_TIME_FORMAT, ORDER_STATUS, POST_TYPE, USER_ROLE } from '@/config/constant';
import { mapState } from 'vuex';
import unionBy from 'lodash/unionBy';
import { getTotalPage, mergeByProp } from '@/helper';
import dayjs from 'dayjs';

export default {
  data () {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 31)
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
      endDate,
      startDate,
      orderField: '',
      sort: 'createdAt:desc',
      transferCode: '',
      orderLoading: false,
      orderGroup: ORDER_GROUPS.WAITING,
      orderStatus: '',
      orderDirection: '',
      orderDetailLoading: false
    }
  },
  computed: {
    ...mapState({
      currentOrder: state => state.orders.order
    }),
    ...mapState('user', ['user']),
    userType () {
      return this.user?.type || ''
    },
    orderMapped () {
      return this.listOrder?.map((item) => {
        return this._hasGroupOrder(item) ? item : null
      }).filter(item => item && ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(item.status))
    },
    params () {
      const filter = {}
      filter.sort = this.sort || 'createdAt:desc'
      this.page && (filter.page = this.page)
      this.type && (filter.type = this.type)
      this.limit && (filter.limit = this.limit)
      this.searchField && (filter.searchField = this.searchField)
      this.searchValue && (filter.searchValue = this.searchValue)
      this.assetType && (filter.assetId = this.assetType)
      this.orderStatus && (filter.status = this.orderStatus)
      this.endDate && (filter.endDate = dayjs(this.endDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      this.startDate && (filter.startDate = dayjs(this.startDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      this.orderField && this.orderDirection && (filter.sort = `${this.orderField}:${this.orderDirection},${filter.sort}`)
      return filter
    }
  },
  watch: {
    currentOrder: {
      handler (order) {
        if (order) {
          if (this.listOrder.length !== 0) {
            this.listOrder = unionBy([order], this.listOrder, 'orderId')
          } else {
            this.listOrder = [order]
          }
        }
      }
    }
  },
  methods: {
    _hasGroupOrder (order) {
      if (![USER_ROLE.USER, USER_ROLE.MERCHANT_OPERATOR].includes(this.userType)) {
        return false
      }
      const orderGroupType = order.postType === POST_TYPE.SELL ? BUY_ORDER_GROUPS : SELL_ORDER_GROUPS
      return orderGroupType[this.userType][this.orderGroup.toUpperCase()]?.includes(order.step)
    },
    $commonOrderMixin_onSearch: debounce(function ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      this.$commonOrdersMixin_getListOrders()
    }, 500),
    async $commonOrderMixin_onRefresh () {
      this.page = 1
      await this.$commonOrdersMixin_getListOrders()
    },
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
      if (!this.orderLoading && this.page < this.totalPages) {
        this.page = this.page + 1
        await this.$commonOrdersMixin_getListOrders(true)
      }
    },
    async $commonOrdersMixin_getListOrders (isMerged = false) {
      try {
        this.orderLoading = true
        const res = await this.$axios.$get(ORDER_API.GET_LIST_ORDER, { params: this.params })
        if (res?.data) {
          if (isMerged) {
            this.listOrder = mergeByProp(this.listOrder, res.data.items, 'orderId')
          } else {
            this.listOrder = res.data.items
          }
          if (this.orderGroup === ORDER_GROUPS.WAITING) {
            this.totalPendingOrder = res.data.totalItems
            this.$emit('update-total-pending', this.totalPendingOrder)
          }
          this.total = res.data.totalItems
          this.totalPages = getTotalPage(res.data.totalItems, this.limit)
        }
        this.orderLoading = false
      } catch (error) {
        this.orderLoading = false
      }
    }
  }
}
