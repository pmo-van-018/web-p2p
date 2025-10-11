import { MODAL } from '@/resources/modal';
import { SHIFT_MANAGEMENT } from '@/api/shift-management';
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
        },
        {
          key: 'action',
          label: this.$t('shift_management.table.action'),
          subLabel: '',
          sortField: '',
          isSort: false,
          align: 'center',
          thStyle: {
            width: '10%'
          }
        }
      ],
      selectedShift: null,
      approveType: 'single', // single | all,
      loading: false,
      isSuccess: false,
      message: ''
    };
  },
  methods: {
    openShiftSubmit ({ shift, type = 'single' }) {
      this.approveType = type
      this.selectedShift = shift
      this.$bvModal.show(MODAL.MODAL_APPROVE_SHIFT)
    },
    closeShiftSubmit () {
      this.$bvModal.hide(MODAL.MODAL_APPROVE_SHIFT)
      this.isSuccess = false
      this.message = ''
      this.loading = false
    },
    async handleSubmitShift () {
      try {
        if (this.loading) {
          return
        }
        this.isSuccess = false;
        this.loading = true;
        let response = null;
        if (this.approveType === 'all') {
          response = await this.$axios.$put(
            SHIFT_MANAGEMENT.APPROVE_ALL_SHIFT,
            {
              ...this.filterOptions
            }
          );
        } else {
          response = await this.$axios.$put(SHIFT_MANAGEMENT.APPROVE_SHIFT?.(this.selectedShift?.id))
        }
        if (response?.errors && response.errors[0]) {
          throw new Error(response.errors[0])
        } else {
          this.isSuccess = true;
          this.message = this.$t(`shift_management.approve_${this.approveType}.success`);
          await this.$_commonShiftManagement_onGetOperatorShiftHistories()
          this.onSetTotalPendingShiftHistories()
        }
      } catch (error) {
        this.message = this.$t(`shift_management.approve_${this.approveType}.error`);
      }
    }
  },
  async created () {
    await this.$_commonShiftManagement_onGetOperatorShiftHistories()
    this.onSetTotalPendingShiftHistories()
  }
}
