import { ADMIN_API } from '@/api/admin'
import isBetween from 'dayjs/plugin/isBetween'
import dayjs from 'dayjs'
import { POST_TYPE, USER_ROLE } from '@/config/constant'
import { mergeByProp } from '@/helper';
import debounce from 'lodash/debounce'
import { mapActions, mapState } from 'vuex'
import { STATUS_APPEAL_OPEN } from '@/resources/order-filters'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'

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
            width: '15%'
          }
        },
        {
          key: 'user',
          label: this.$t('admin.table.merchant'),
          subLabel: this.$t('admin.table.user'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'timeAppeal',
          label: this.$t('admin.table.time_appeal'),
          subLabel: this.$t('admin.table.ended_time'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
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
          align: 'right',
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
      totalPages: 0,
      tabActiveCallApi: 'pending',
      totalPendingAppeal: 0,
      totalProcessingAppeal: 0,
      limitAppealReceived: 0,
      totalPicked: 0
    }
  },
  created () {
    this.$_appealSupporterMixin_getAppealReceiveLimit()
  },
  computed: {
    ...mapState('user', ['user'])
  },
  methods: {
    ...mapActions('admin-appeal', ['setWaitingAppealCount']),
    ...mapActions('modal-response', ['showResponseModal']),
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
      await this.$_appealSupporterMixin_onFilterAppeal({
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
      await this.$_appealSupporterMixin_onSortAppeal({ sortField, sortDirection })
    },
    async onChangePage ({ limit, page }) {
      await this.$_appealSupporterMixin_onChangePage({ limit, page })
    },
    formatStartTimeAppeal (appeal) {
      const openAt = appeal.openAt || ''
      return this.$options.filters.formatDateTime(openAt)
    },
    isTimeOut (appeal) {
      return !dayjs().isBetween(appeal.openAt, appeal.completedAt, 'seconds', '[]')
    },
    formatLimitNickName (nickName) {
      return nickName.substring(0, 20) + (nickName.length > 20 ? '...' : '')
    },
    formatCloseTimeAppeal (appeal) {
      const completedAt = appeal.completedAt || ''

      if (this.isTimeOut(appeal)) {
        return this.$t('admin.table.closed_time')
      }

      return this.$options.filters.formatDateTime(completedAt)
    },
    async $_appealSupporterMixin_onFilterAppeal ({
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
      await this.$_appealSupporterMixin_getAppealList()
    },
    async $_appealSupporterMixin_onRefresh () {
      this.page = 1
      await this.$_appealSupporterMixin_getAppealList()
    },
    $_appealSupporterMixin_onSearchAppealOrder: debounce(function ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      this.page = 1
      this.$_appealSupporterMixin_getAppealList()
    }, 500),
    async $_appealSupporterMixin_onSortAppeal ({
      sortField, sortDirection
    }) {
      this.page = 1
      this.orderDirection = sortDirection
      this.orderField = sortField
      await this.$_appealSupporterMixin_getAppealList()
    },
    async $_appealSupporterMixin_onChangePage ({
      limit,
      page
    }) {
      this.limit = limit
      this.page = page
      await this.$_appealSupporterMixin_getAppealList()
    },
    async $_appealSupporterMixin_countAppealPicked () {
      try {
        const { data } = await this.$axios.$get(ADMIN_API.APPEAL_PICKED_COUNT);
        this.totalPicked = data?.total || 0
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },
    async $_appealSupporterMixin_getAppealList (isMergeOldData = false) {
      try {
        this.isLoading = true
        await this.$_appealSupporterMixin_countAppealPicked()
        if (this.tabActiveCallApi === 'processing') {
          delete this.queryParams?.page
          delete this.queryParams?.limit
        }
        const res = await this.$axios.$get(ADMIN_API.APPEAL_LISTING, { params: this.queryParams });
        if (res?.data) {
          if (isMergeOldData) {
            this.listAppeal = mergeByProp(this.listAppeal, res.data?.items, 'id')
          } else {
            this.listAppeal = res.data?.items || [];
          }
          this.total = res.data?.totalItems;
          this.totalPages = res.data?.totalPages
          if (this.queryParams?.appealStatus === STATUS_APPEAL_OPEN) {
            this.setWaitingAppealCount(this.total || 0);
          }
          if (this.tabActiveCallApi === 'pending') {
            this.totalPendingAppeal = this.total
            this.$emit('update-total-pending', this.total)
          }
          if (this.tabActiveCallApi === 'processing') {
            this.totalProcessingAppeal = this.total
            this.$emit('update-total-processing', this.total)
          }
        }
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    async $_appealSupporterMixin_getAppealReceiveLimit () {
      try {
        this.isLoading = true
        const res = await this.$axios.$get(ADMIN_API.GET_SETTING_LIMIT_BY_SUPPORTER);
        this.limitAppealReceived = res?.data?.appealReceiveLimit || 0
        this.isLoading = false
      } catch (error) {
        this.isLoading = false
      }
    },
    async $_appealSupporterMixin_onPickAppealOrder (appeal) {
      try {
        this.$set(appeal, '_loadingButton', true)
        const { errors } = await this.$axios.$post(`${ADMIN_API.PICK_APPEAL}/${appeal.id}`)
        if (errors) {
          const keyError = errors[0]?.key || 'error_system'
          const modalConfig = {
            title: this.$t('modal.title.system'),
            description: this.$t(`modal.message.${keyError}`),
            content: '',
            show: true
          };

          switch (keyError) {
            case 'TOTAL_ORDER_PICKED_LIMITS_ARE_EXCEEDED':
              modalConfig.description = this.$t(`modal.message.${keyError}`, {
                count: this.limitAppealReceived
              });
              modalConfig.icon = RESPONSE_ICON.NOT_ALLOWED_APPEAL;
              modalConfig.confirmAction = this.$t('action.confirm');
              modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
              break;
            case 'APPEAL_ALREADY_HAS_SUPPORTER':
              modalConfig.icon = RESPONSE_ICON.APPEAL_PROCEED;
              break;
            default:
              modalConfig.icon = RESPONSE_ICON.RESPONSE_FAILED;
              break;
          }

          this.showResponseModal(modalConfig);
          return
        }
        await this.$_appealSupporterMixin_getAppealList()
      } catch (error) {
        const keyError = error.response?.data?.errors[0]?.key || 'error_system'
        const modalConfig = {
          title: this.$t('modal.title.system'),
          description: this.$t(`modal.message.${keyError}`),
          content: '',
          show: true
        };

        this.showResponseModal(modalConfig);
      } finally {
        this.$set(appeal, '_loadingButton', false)
      }
    },
    $_appealSupporterMixin_onOpenAppealDetail (appealId) {
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
    gotoDashboard (order) {
      order?.manager?.id && this.$router.push(`/merchant-managers/dashboard/${order?.manager?.id}`)
    }
  }
}
