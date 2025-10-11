import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from '@/config/constant';
import { mergeByProp } from '@/helper';
import { ADMIN_USERS } from '@/api/merchant-manager';

export default {
  data () {
    return {
      isLoading: true,
      total: 0,
      limit: 10,
      page: 1,
      orderField: '',
      orderDirection: '',
      searchValue: '',
      searchType: '',
      endDate: null,
      startDate: null,
      fieldDate: '',
      users: [],
      fields: [
        {
          key: 'nickName',
          label: this.$t('staff.key.nickname'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'walletAddress',
          label: this.$t('staff.wallet_address'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '35%',
            minWidth: '220px'
          }
        },
        {
          key: 'buyOrder',
          label: this.$t('staff.key.buy_order'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '17%'
          },
          tdClass: 'text-center'
        },
        {
          key: 'sellOrder',
          label: this.$t('staff.key.sell_order'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '17%'
          },
          tdClass: 'text-center'
        },
        {
          key: 'lastTrade',
          label: this.$t('staff.key.last_trade'),
          subLabel: '',
          sortField: 'lastTradeAt',
          isSort: true,
          thStyle: {
            width: '17%'
          }
        },
        {
          key: 'lastLogin',
          label: this.$t('staff.key.last_login'),
          subLabel: '',
          sortField: 'lastLoginAt',
          isSort: true,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'createdAt',
          label: this.$t('staff.key.created_at'),
          subLabel: '',
          sortField: 'createdAt',
          isSort: true,
          thStyle: {
            width: '12%'
          }
        }
      ]
    }
  },
  async created () {
    await this.$_userMixin_getList()
  },
  computed: {
    params () {
      const filter = {}
      this.page && (filter.page = this.page)
      this.limit && (filter.limit = this.limit)
      this.orderField && (filter.orderField = this.orderField)
      this.orderDirection && (filter.orderDirection = this.orderDirection)
      this.searchValue && (filter.searchValue = this.searchValue)
      this.searchType && (filter.searchType = this.searchType)
      this.endDate && (filter.endDate = dayjs(this.endDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      this.startDate && (filter.startDate = dayjs(this.startDate).format(DATE_TIME_FORMAT.DATE_ONLY))
      this.fieldDate && (filter.fieldDate = this.fieldDate)
      return filter
    }
  },
  methods: {
    async $_userMixin_handleChangeSort ({ sortField, sortDirection }) {
      this.orderField = ''
      this.orderDirection = ''
      if (sortField && sortDirection) {
        this.orderField = sortField
        this.orderDirection = sortDirection
      }
      await this.$_userMixin_getList()
    },
    async $_userMixin_onRefresh () {
      this.page = 1
      await this.$_userMixin_getList()
    },
    async $_userMixin_onFilter (options) {
      const { startDate, endDate, fieldDate, search, field } = options
      this.startDate = startDate
      this.endDate = endDate
      this.fieldDate = fieldDate
      this.searchValue = search
      this.searchType = field
      this.page = 1
      await this.$_userMixin_getList()
    },
    async $_userMixin_onChangePage ({ page, limit }) {
      this.page = page
      this.limit = limit
      await this.$_userMixin_getList()
    },
    async $_userMixin_getList () {
      try {
        this.isLoading = true;
        const { data } = await this.$axios.$get(ADMIN_USERS, { params: this.params });
        this.users = data?.items
        this.total = data?.totalItems || 0
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
      }
    },
    async $_userMixin_getInfiniteList () {
      try {
        this.isLoading = true;
        const { data } = await this.$axios.$get(ADMIN_USERS, { params: this.params });
        const mergeData = mergeByProp(this.staffs, data.items, 'id')
        this.users = mergeData
        this.total = data?.totalItems || 0
      } catch (error) {
        /* eslint-disable no-console */
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
