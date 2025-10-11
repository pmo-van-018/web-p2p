import dayjs from 'dayjs'
import { USER_ROLE } from '@/config/constant'
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapState } from 'vuex'
import { CUSTOMER_SUPPORT_STATUS } from '@/constants/customer-support'
import { CONFIRM_TYPE, RESPONSE_ICON } from '@/resources/message'
import { ADMIN_API } from '@/api/admin';
import ADMIN_SUPPORTER_API, { RECEIVE_SUPPORT_REQUEST_BY_ID } from '~/api/admin-supporter'
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
          sortField: 'CREATE_TIME',
          isSort: true,
          thStyle: {
            width: '15%'
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
          key: 'status',
          label: this.$t('customer_care.table.status'),
          subLabel: '',
          sortField: '',
          isSort: false
        },
        {
          key: 'actions',
          label: this.$t('customer_care.table.action'),
          subLabel: '',
          sortField: '',
          align: 'center',
          isSort: false,
          roles: [USER_ROLE.ADMIN_SUPPORTER]
        }
      ],
      totalPicked: 0,
      limitReceived: 0
    }
  },
  computed: {
    ...mapState('user', ['user']),
    fieldsMapped () {
      return this.fields.filter(item => isEmpty(item.roles) || item.roles.includes(this.user?.type))
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    async $pendingRequestMixin_handleFilter (options) {
      const {
        startDate,
        endDate,
        searchField,
        searchValue,
        type,
        step
      } = options
      this.page = 1
      this.type = type
      this.startDate = startDate
      this.endDate = endDate
      this.searchField = searchField
      this.searchValue = searchValue
      this.step = step
      this.status = CUSTOMER_SUPPORT_STATUS.PENDING
      await this.$commonRequestSupportMixin_getListSupportRequests()
    },
    async $pendingRequestMixin_onResetFilter () {
      this.$pendingRequestMixin_onResetStateFilter()
      await Promise.all([
        this.$commonRequestSupportMixin_countListSupportRequestsPending(),
        this.$commonRequestSupportMixin_getListSupportRequests()
      ])
    },
    $pendingRequestMixin_onResetStateFilter () {
      this.type = ''
      this.searchField = ''
      this.searchValue = ''
      this.endDate = ''
      this.startDate = ''
      this.readonly = true
      this.sort = 'updatedAt:asc'
      this.limit = 10
      this.status = CUSTOMER_SUPPORT_STATUS.PENDING
    },
    async $pendingRequestMixin_getCountSupportRequest (item) {
      try {
        const { data } = await this.$axios.$get(ADMIN_SUPPORTER_API.COUNT_SUPPORT_REQUESTS_RECEIVED);
        this.totalPicked = data.total
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
      }
    },
    async $pendingRequestMixin_getRequestReceiveLimit () {
      try {
        const res = await this.$axios.$get(ADMIN_API.GET_SETTING_LIMIT_BY_SUPPORTER);
        this.limitReceived = res?.data?.requestReceiveLimit || 0
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    },
    async $pendingRequestMixin_onReceivedSupportRequest (item) {
      try {
        this.$set(item, '_loadingButton', true)
        const { errors } = await this.$axios.$put(RECEIVE_SUPPORT_REQUEST_BY_ID(item.id));
        if (errors?.length) {
          this.handleError(errors[0].key)
          return
        }
        await Promise.all([
          this.$commonRequestSupportMixin_getListSupportRequests(),
          this.$pendingRequestMixin_getCountSupportRequest(),
          this.$commonRequestSupportMixin_countListSupportRequestsPending()
        ])
      } catch (error) {
        const keyError = error.response?.data?.errors[0]?.key || 'error_system'
        this.handleError(keyError)
      } finally {
        this.$set(item, '_loadingButton', false)
      }
    },
    handleError (keyError) {
      const modalConfig = {
        title: this.$t('modal.title.system'),
        description: this.$t(`modal.message.${keyError}`),
        content: '',
        show: true
      };
      switch (keyError) {
        case 'TOTAL_REQUEST_PICKED_LIMITS_ARE_EXCEEDED':
          modalConfig.description = this.$t(`modal.message.${keyError}`, {
            count: this.limitReceived
          });
          modalConfig.icon = RESPONSE_ICON.NOT_ALLOWED_SUPPORT;
          modalConfig.confirmAction = this.$t('action.confirm');
          modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
          break;
        case 'SUPPORT_REQUEST_ALREADY_RECEIVED':
          modalConfig.icon = RESPONSE_ICON.SUPPORT_PROCEED;
          modalConfig.confirmAction = this.$t('action.confirm');
          modalConfig.confirmActionType = CONFIRM_TYPE.CLOSE;
          break;
        default:
          modalConfig.icon = RESPONSE_ICON.RESPONSE_FAILED;
          break;
      }

      this.showResponseModal(modalConfig);
    },
    formatDateTime (time) {
      return dayjs(time).format(FULL_DATE_FORMAT)
    }
  }
}
