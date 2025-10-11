import commonShiftManagementMixin from '~/mixins/merchant-manager/shift-management/common'

export default {
  mixins: [commonShiftManagementMixin],
  data () {
    return {
      fields: [
        {
          key: 'nickName',
          label: this.$t('shift_management.table.nick_name'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'startTime',
          label: this.$t('shift_management.table.check_in_date'),
          subLabel: '',
          sortField: 'checkIn',
          isSort: true,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'startBalanceAmount',
          label: this.$t('shift_management.table.check_in_amount'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'endTime',
          label: this.$t('shift_management.table.check_out_date'),
          subLabel: '',
          sortField: 'checkOut',
          isSort: true,
          thStyle: {
            width: '12%'
          }
        },
        {
          key: 'endBalanceAmount',
          label: this.$t('shift_management.table.check_out_amount'),
          subLabel: '',
          sortField: '',
          isSort: false,
          thStyle: {
            width: '15%'
          }
        },
        {
          key: 'orderAmount',
          label: this.$t('shift_management.table.amount'),
          subLabel: '',
          sortField: 'orderAmount',
          isSort: true,
          thStyle: {
            width: '11%'
          }
        },
        {
          key: 'workingDate',
          label: this.$t('shift_management.table.working_date'),
          subLabel: '',
          sortField: 'duringTime',
          isSort: true,
          thStyle: {
            width: '10%'
          }
        }
      ]
    };
  },
  async created () {
    await this.$_commonShiftManagement_onGetOperatorShiftHistories()
  }
}
