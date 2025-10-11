import dayjs from 'dayjs'
import { CUSTOMER_SUPPORT_STATUS } from '@/constants/customer-support'
import { USER_ROLE } from '@/config/constant'
import { mapState } from 'vuex';
import isEmpty from 'lodash/isEmpty';
import commonCustomersCareMixin from '~/mixins/admin-supporter/customers-care/common.js'
import { FULL_DATE_FORMAT } from '~/config/constant'

export default {
  mixins: [commonCustomersCareMixin],
  data () {
    return {
      fields: [
        {
          key: 'userRequest',
          label: this.$t('customer_care.table.user_request'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'refId',
          label: this.$t('customer_care.table.key_request'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '16%'
          }
        },
        {
          key: 'topic',
          label: this.$t('customer_care.table.topic'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '16%'
          }
        },
        {
          key: 'adminName',
          label: this.$t('customer_care.table.supporter'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '20%'
          },
          align: 'center',
          roles: [USER_ROLE.SUPER_ADMIN]
        },
        {
          key: 'timeRequest',
          label: this.$t('customer_care.table.time_request'),
          subLabel: '',
          sortField: 'CREATE_TIME',
          isSort: true,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'timeProcess',
          label: this.$t('customer_care.table.time_process'),
          subLabel: '',
          sortField: 'COMPLETE_TIME',
          isSort: true
        },
        {
          key: 'actions',
          label: this.$t('customer_care.table.message'),
          subLabel: '',
          sortField: '',
          align: 'center',
          isSort: false
        }
      ]
    }
  },
  computed: {
    ...mapState('user', ['user']),
    fieldsMapped () {
      return this.fields.filter(item => isEmpty(item.roles) || item.roles.includes(this.user?.type))
    }
  },
  methods: {
    async $completedRequestMixin_handleFilter (options) {
      const {
        startDate,
        endDate,
        searchField,
        searchValue,
        type
      } = options
      this.page = 1
      this.type = type
      this.startDate = startDate
      this.endDate = endDate
      this.searchField = searchField
      this.searchValue = searchValue
      this.status = CUSTOMER_SUPPORT_STATUS.COMPLETED
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    async $completedRequestMixin_onResetFilter () {
      this.$completedRequestMixin_onResetStateFilter()
      await Promise.all([
        this.$commonRequestSupportMixin_countListSupportRequestsPending(),
        this.$commonRequestSupportMixin_getListSupportRequests()
      ])
    },
    $completedRequestMixin_onResetStateFilter () {
      this.type = ''
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.readonly = false
      this.sort = 'updatedAt:asc'
      this.limit = 10
      this.orderField = 'COMPLETE_TIME'
      this.orderDirection = 'DESC'
      this.status = CUSTOMER_SUPPORT_STATUS.COMPLETED
    },
    async $completedRequestMixin_onSearch ({ searchField, searchValue }) {
      this.searchField = searchField
      this.searchValue = searchValue
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    async $completedRequestMixin_onFilter (options) {
      const { type, search, supporterId } = options
      this.type = type
      this.search = search
      this.page = 1
      this.supporterId = supporterId
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    formatDateTime (time) {
      return dayjs(time).format(FULL_DATE_FORMAT)
    }
  }
}
