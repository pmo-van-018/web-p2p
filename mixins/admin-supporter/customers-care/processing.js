import dayjs from 'dayjs'
import { mapState } from 'vuex'
import { CUSTOMER_SUPPORT_STATUS } from '@/constants/customer-support';
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
          key: 'timeRequest',
          label: this.$t('customer_care.table.time_request'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'status',
          label: this.$t('customer_care.table.status'),
          subLabel: '',
          sortField: '',
          isSort: false
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
    ...mapState('chat-support-request', ['lastMessages']),
    supportRequests () {
      return this.items.map((item) => {
        const lastMessage = this.lastMessages.find(message => item.roomId === message.roomId)
        return {
          ...item,
          isSeenMessage: lastMessage?.seen || false
        }
      })
    },
    roomIds () {
      return this.supportRequests?.map(item => item.roomId).filter(id => id) || []
    }
  },
  methods: {
    async $processingRequestMixin_handleFilter (options) {
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
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    async $processingRequestMixin_onResetFilter () {
      this.$processingRequestMixin_onResetStateFilter()
      await Promise.all([
        this.$commonRequestSupportMixin_countListSupportRequestsPending(),
        this.$commonRequestSupportMixin_getListSupportRequests()
      ])
    },
    $processingRequestMixin_onResetStateFilter () {
      this.type = ''
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.sort = 'updatedAt:asc'
      this.readonly = false
      this.limit = 10
      this.status = CUSTOMER_SUPPORT_STATUS.PROCESSING
    },
    formatDateTime (time) {
      return dayjs(time).format(FULL_DATE_FORMAT)
    }
  }
}
