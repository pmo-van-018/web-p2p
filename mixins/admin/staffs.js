import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '@/config/constant';
import { mergeByProp } from '@/helper';
import { ADMIN_STAFF } from '@/api/admin-staff';

export default {
  data () {
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 31)

    return {
      isLoading: true,
      total: 0,
      totalPages: 0,
      merchantManagerId: '',
      limit: 10,
      page: 1,
      search: '',
      status: '',
      type: '',
      endDate,
      startDate,
      staffs: [],
      fields: [
        {
          key: 'walletAddress',
          label: this.$t('staff.wallet_address'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '36%',
            minWidth: '220px'
          }
        },
        {
          key: 'nickName',
          label: this.$t('staff.key.nickname'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'postingOnline',
          label: this.$t('staff.key.post_online'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '9%'
          }
        },
        {
          key: 'pendingOrders',
          label: this.$t('staff.key.pending_orders'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '8%'
          }
        },
        {
          key: 'type',
          label: this.$t('role_management.label.type'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'merchant',
          label: this.$t('staff.key.merchant'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'status',
          label: this.$t('staff.status'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '10%'
          }
        },
        {
          key: 'updateAt',
          label: this.$t('staff.key.created_at'),
          subLabel: this.$t('staff.key.updated_at'),
          sortField: '',
          isSort: false,
          thStyle: {
            width: '13%'
          }
        },
        {
          key: 'action',
          label: this.$t('staff.key.action'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '5%'
          }
        }
      ]
    }
  },
  computed: {
    params () {
      const filter = {}
      this.page && (filter.page = this.page)
      this.limit && (filter.limit = this.limit)
      this.search && (filter.search = this.search)
      this.status && (filter.status = this.status)
      this.type && (filter.type = this.type)
      this.merchantManagerId && (filter.merchantManagerId = this.merchantManagerId)
      this.endDate && (filter.endDate = dayjs(this.endDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      this.startDate && (filter.startDate = dayjs(this.startDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      return filter
    },
    postfix () {
      return this.currentStaff?.id ? this.currentStaff?.id?.toString() : ''
    }
  },
  methods: {
    async $_staffMixin_handleChangeSort ({ sortField, sortDirection }) {
      this.orderField = sortField
      this.orderDirection = sortDirection
      await this.$_staffMixin_getList()
    },
    async $_staffMixin_onRefresh () {
      this.page = 1
      await this.$_staffMixin_getList()
    },
    async $_staffMixin_onFilter (options) {
      const { startDate, endDate, search, status, merchantManagerId, type } = options
      this.startDate = startDate
      this.endDate = endDate
      this.search = search
      this.status = status
      this.type = type
      this.merchantManagerId = merchantManagerId
      this.page = 1
      await this.$_staffMixin_getList()
    },
    async $_staffMixin_onSearch (keyword) {
      this.page = 1
      this.search = keyword
      await this.$_staffMixin_getList()
    },
    async $_staffMixin_onChangePage ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.$_staffMixin_getList()
    },
    async $_staffMixin_getList () {
      try {
        this.isLoading = true;
        const { data } = await this.$axios.$get(ADMIN_STAFF.INDEX, { params: this.params });
        this.staffs = data.items
        this.total = data?.totalItems || 0
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async $_staffMixin_getInfiniteList () {
      try {
        this.isLoading = true;
        const { data } = await this.$axios.$get(ADMIN_STAFF.INDEX, { params: this.params });
        const mergeData = mergeByProp(this.staffs, data.items, 'id')
        this.staffs = mergeData
        this.total = data?.totalItems || 0
        this.totalPages = data?.totalPages || 0
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
