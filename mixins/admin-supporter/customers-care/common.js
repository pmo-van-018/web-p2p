import { USER_ROLE } from '@/config/constant';
import { getTotalPage, mergeByProp } from '@/helper';
import debounce from 'lodash/debounce'
import STATUS_API from '@/api/status.js'
import { mapState, mapActions } from 'vuex';
import { CUSTOMER_SUPPORT_STEP } from '@/constants/customer-support'
import ADMIN_SUPPORTER_API from '~/api/admin-supporter'

export default {
  data () {
    return {
      onlineInterval: null,
      isSkeletonLoading: true,
      items: [],
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
      readonly: false,
      step: '',
      sort: 'updatedAt:asc',
      requestLoading: false,
      status: ''
    }
  },
  computed: {
    ...mapState('user', ['user'])
  },
  beforeDestroy () {
    this.onlineInterval && clearInterval(this.onlineInterval);
  },
  methods: {
    ...mapActions('admin-support', ['setSupportRequestCount']),
    async $commonRequestSupportMixin_onRefresh () {
      this.page = 1
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    async $commonRequestSupportMixin_onInfiniteLoading () {
      if (!this.requestLoading && this.page < this.totalPages) {
        this.page = this.page + 1
        await this.$commonRequestSupportMixin_getListSupportRequests(true)
      }
    },
    $commonRequestSupportMixin_onSearch: debounce(function ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      this.$commonRequestSupportMixin_getListSupportRequests()
    }, 500),
    async $commonRequestSupportMixin_handleChangeSort ({ sortField, sortDirection }) {
      this.orderField = sortField
      this.orderDirection = sortDirection
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    async $commonRequestSupportMixin_onChangePage ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    params () {
      const filter = {}
      this.page && (filter.page = this.page)
      this.type && (filter.type = this.type)
      this.sort && (filter.sort = this.sort)
      this.readonly && this.user?.type !== USER_ROLE.SUPER_ADMIN && (filter.readonly = this.readonly)
      this.orderField && (filter.sortField = this.orderField)
      this.orderDirection && (filter.sortType = this.orderDirection)
      this.limit && (filter.limit = this.limit)
      this.searchField && (filter.searchField = this.searchField)
      this.searchValue && (filter.searchValue = this.searchValue)
      this.endDate && (filter.createdTo = this.endDate)
      this.startDate && (filter.createdFrom = this.startDate)
      this.step && (filter.received = this.step === CUSTOMER_SUPPORT_STEP.RECEIVED)
      this.status && (filter.status = this.status)
      return filter
    },
    async fetchOnlineStatus (userIds) {
      try {
        const res = await this.$axios.$get(STATUS_API.CHECK, { params: { accountIds: userIds } })
        if (res?.data) {
          const results = res.data?.statuses;
          this.items.forEach((item) => {
            item.online = results?.[item.userId] ?? false
          })
        }
      } catch (error) {
      }
    },
    async $commonRequestSupportMixin_getListSupportRequests (isMerged = false) {
      try {
        this.requestLoading = true
        this.onlineInterval && clearInterval(this.onlineInterval);
        const res = await this.$axios.$get(ADMIN_SUPPORTER_API.LIST_SUPPORT_REQUESTS, { params: this.params() })
        if (res?.data) {
          res.data?.items.forEach(item => (item.online = false));
          if (isMerged) {
            this.items = mergeByProp(this.items, res.data?.items, 'id')
          } else {
            this.items = res.data?.items
          }
          this.total = res.data.totalItems
          this.totalPages = getTotalPage(res.data.total, this.limit)
          const statusFn = async () => {
            const userIds = this.items.map(item => item.userId)
            await this.fetchOnlineStatus(userIds);
          }
          await statusFn();
          this.onlineInterval = setInterval(statusFn, 30000);
        }
        this.requestLoading = false
      } catch (error) {
        this.requestLoading = false
      }
    },
    $commonRequestSupportMixin_onOpenDetailRequest (item) {
      this.$router.push(`/admin-supporter/support-requests/${item.id}`)
    },
    async $commonRequestSupportMixin_countListSupportRequestsPending () {
      try {
        const res = await this.$axios.$get(ADMIN_SUPPORTER_API.COUNT_PENDING_SUPPORT_REQUESTS)
        const total = res.data.total || 0
        this.setSupportRequestCount(total)
        this.$emit('update-total-pending', total)
      } catch (error) {
      }
    }
  }
}
