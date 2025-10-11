import { ADMIN_API } from '@/api/admin'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs from 'dayjs'
import { POST_TYPE, USER_ROLE } from '@/config/constant'
import { mergeByProp } from '@/helper';
import debounce from 'lodash/debounce'
import { mapActions, mapState } from 'vuex'
import { STATUS_APPEAL_OPEN } from '@/resources/order-filters'

dayjs.extend(isBetween)

export default {
  data () {
    return {
      POST_TYPE,
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
          sortField: 'amount',
          isSort: true,
          thStyle: {
            width: '13%'
          }
        },
        {
          key: 'user',
          label: this.$t('admin.table.merchant'),
          subLabel: this.$t('admin.table.user'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '13%'
          }
        },
        {
          key: 'timeAppeal',
          label: this.$t('admin.table.time_appeal'),
          subLabel: this.$t('admin.table.ended_time'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '11%'
          }
        },
        {
          key: 'nameAdminSupporter',
          label: this.$t('admin.table.admin_supporter'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '11%'
          }
        },
        {
          key: 'numberOfExtension',
          label: this.$t('admin.table.number_of_extension'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '6%'
          }
        },
        {
          key: 'progressing',
          label: this.$t('admin.table.progressing'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'actions',
          label: this.$t('admin.table.action'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '10%'
          }
        }
      ],
      isLoading: false,
      page: 1,
      limit: 10,
      orderStatus: '',
      startDate: null,
      endDate: null,
      orderDirection: 'ASC',
      orderField: 'createdAt',
      searchField: '',
      searchValue: '',
      type: '',
      assetId: '',
      total: 0,
      listAppeal: [],
      totalPending: 0,
      totalPages: 0
    }
  },
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('admin-appeal', ['setWaitingAppealCount']),
    async handleFilterAppeal (options) {
      const {
        type,
        orderStatus,
        asset,
        searchField,
        searchValue,
        startDate,
        endDate
      } = options
      await this.$_appealListingMixin_onFilterAppeal({
        type,
        orderStatus,
        asset,
        searchField,
        searchValue,
        startDate,
        endDate
      })
    },
    async handleChangeSort ({ sortField, sortDirection }) {
      await this.$_appealListingMixin_onSortAppeal({ sortField, sortDirection })
    },
    async onChangePage ({ limit, page }) {
      await this.$_appealListingMixin_onChangePage({ limit, page })
    },
    formatStartTimeAppeal (appeal) {
      const openAt = appeal.openAt || ''
      return this.$options.filters.formatDateTime(openAt)
    },
    isTimeOut (appeal) {
      return !dayjs().isBetween(appeal.openAt, appeal.completedAt, 'seconds', '[]')
    },
    formatLimitNickName (nickName = '') {
      return nickName.substring(0, 20) + (nickName.length > 20 ? '...' : '')
    },
    formatCloseTimeAppeal (appeal) {
      const completedAt = appeal.completedAt || ''

      if (this.isTimeOut(appeal)) {
        return this.$t('admin.table.closed_time')
      }

      return this.$options.filters.formatDateTime(completedAt)
    },
    async $_appealListingMixin_onFilterAppeal ({
      type,
      orderStatus,
      startDate,
      endDate,
      asset,
      searchField,
      searchValue
    }) {
      this.page = 1
      this.type = type
      this.orderStatus = orderStatus
      this.searchField = searchField
      this.searchValue = searchValue
      this.asset = asset
      this.startDate = startDate
      this.endDate = endDate
      this.assetId = asset
      await this.$_appealListingMixin_getAppealList()
    },
    async $_appealListingMixin_onRefresh () {
      this.page = 1
      await this.$_appealListingMixin_getAppealList()
    },
    $_appealListingMixin_onSearchAppealOrder: debounce(function ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      this.$_appealListingMixin_getAppealList()
    }, 500),
    async $_appealListingMixin_onSortAppeal ({
      sortField, sortDirection
    }) {
      this.page = 1
      this.orderDirection = sortDirection
      this.orderField = sortField
      await this.$_appealListingMixin_getAppealList()
    },
    async $_appealListingMixin_onChangePage ({
      limit,
      page
    }) {
      this.limit = limit
      this.page = page
      await this.$_appealListingMixin_getAppealList()
    },
    async $_appealListingMixin_onResetFilter () {
      this.page = 1
      await this.$_appealListingMixin_getAppealList()
    },
    async $_appealListingMixin_getAppealList (isMergeOldData = false) {
      try {
        this.isLoading = true
        const res = await this.$axios.$get(ADMIN_API.APPEAL_LISTING, { params: this.queryParams });
        if (res?.data) {
          if (isMergeOldData) {
            this.listAppeal = mergeByProp(this.listAppeal, res.data?.items, 'id')
          } else {
            this.listAppeal = res.data?.items || [];
          }
          this.total = res.data?.totalItems;
          this.totalPages = res.data?.totalPages;
          if (this.queryParams?.appealStatus === STATUS_APPEAL_OPEN) {
            this.setWaitingAppealCount(this.total || 0);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    $_appealListingMixin_onOpenAppealDetail (appealId) {
      if (this.user?.type === USER_ROLE.ADMIN_SUPPORTER) {
        this.$router.push({
          path: '/admin-supporter/appeal-detail',
          query: {
            appealId
          }
        })
        return;
      }
      this.$router.push({
        path: '/appeal-detail',
        query: {
          appealId
        }
      })
    },
    gotoDashboard (id) {
      id && this.$router.push(`/merchant-managers/dashboard/${id}`)
    }
  }
}
