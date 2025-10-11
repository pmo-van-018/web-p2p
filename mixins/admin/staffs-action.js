import { MODAL } from '@/resources/modal';
import { ADMIN_STAFF } from '@/api/admin-staff';
import isEmpty from 'lodash/isEmpty';
import { USER_ROLE, USER_ROLE_CODE } from '@/config/constant';
import { differenceObject } from '@/helper/difference';
import { LIST_STATUS } from '@/resources/role-management'

export default {
  data () {
    return {
      currentStaff: null,
      isConfirmUpdateStatus: false,
      successfulResult: null,
      errorResult: null,
      currentStatus: 0
    }
  },
  computed: {
    postfix () {
      return this.currentStaff?.id ? this.currentStaff?.id?.toString() : ''
    },
    titleStatus () {
      if (USER_ROLE_CODE[this.currentStaff?.type] === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return {
          active: this.$t('staffs.change_status.title_active.merchant_operator'),
          inActive: this.$t('staffs.change_status.title_inactive.merchant_operator')
        }
      }
      if (USER_ROLE_CODE[this.currentStaff?.type] === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return {
          active: this.$t('staffs.change_status.title_active.merchant_supporter'),
          inActive: this.$t('staffs.change_status.title_inactive.merchant_supporter')
        }
      }
      return {
        active: '',
        inActive: ''
      }
    },
    descriptionStatus () {
      if (USER_ROLE_CODE[this.currentStaff?.type] === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return {
          active: this.$t('staffs.change_status.description_active.merchant_operator'),
          inActive: this.$t('staffs.change_status.description_inactive.merchant_operator')
        }
      }
      if (USER_ROLE_CODE[this.currentStaff?.type] === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return {
          active: this.$t('staffs.change_status.description_active.merchant_supporter'),
          inActive: this.$t('staffs.change_status.description_inactive.merchant_supporter')
        }
      }
      return {
        active: '',
        inActive: ''
      }
    }
  },
  methods: {
    $_staffActionMixin_onEditStaff (staff) {
      this.currentStaff = staff
      this.$bvModal.show(MODAL.EDIT_ADMIN_STAFF)
    },
    $_staffActionMixin_onShowModalDeleteStaff () {
      this.$bvModal.hide(MODAL.EDIT_ADMIN_STAFF)
      setTimeout(() => {
        this.$bvModal.show(MODAL.DELETE_ADMIN_STAFF)
      }, 100)
    },
    $_staffActionMixin_onUpdateStatusStaff ({ statusAsBoolean, currentStatus, walletAddress, nickName }) {
      this.isConfirmUpdateStatus = statusAsBoolean
      this.currentStatus = currentStatus
      this.walletAddress = walletAddress
      this.nickName = nickName
      this.$bvModal.hide(MODAL.EDIT_ADMIN_STAFF)
      setTimeout(() => {
        this.$bvModal.show(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT)
      }, 100)
    },
    handleSuccessfulCreating (staff) {
      this.successfulResult = staff
      this.$bvModal.hide(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT)
      setTimeout(() => {
        this.$bvModal.show(`${MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT}${this.postfix}`)
      }, 100)
    },
    handleFailedUpdate (result) {
      this.errorResult = result
      this.$bvModal.hide(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT)
      setTimeout(() => {
        this.$bvModal.show(`${MODAL.FAILURE_RESULT_ROLE_MANAGEMENT}${this.postfix}`)
      }, 100)
    },
    async $_staffActionMixin_updateInfoStaff () {
      try {
        const id = this.currentStaff.id
        const data = {
          id: this.currentStaff.id,
          nickName: this.nickName,
          status: this.currentStatus,
          walletAddress: this.walletAddress
        }
        const statusObj = LIST_STATUS[this.currentStaff?.status]
        const currentStaffFormat = {
          id: this.currentStaff.id,
          nickName: this.currentStaff?.nickName,
          status: statusObj?.id,
          walletAddress: this.currentStaff?.walletAddress
        }
        const payload = differenceObject(data, currentStaffFormat)
        if (payload && payload.status) {
          let result;
          if (payload.status === LIST_STATUS.ACTIVE.id) {
            result = await this.$axios.$put(`${ADMIN_STAFF.ACTIVE_STAFF(id)}`)
          } else if (payload.status === LIST_STATUS.INACTIVE.id) {
            result = await this.$axios.$put(`${ADMIN_STAFF.INACTIVE_STAFF(id)}`)
          }
          if (!isEmpty(result?.data)) {
            this.handleSuccessfulCreating(result.data)
            return
          }
          this.handleFailedUpdate(result)
        } else {
          this.handleSuccessfulCreating(this.currentStaff)
          return
        }
      } catch (error) {
        this.handleFailedUpdate(error)
      }
    },
    isOperator (item) {
      return item.type === USER_ROLE.MERCHANT_OPERATOR
    },
    goToDashboard (item) {
      if (this.isOperator(item)) {
        item?.id && this.$router.push(`/staffs/${item?.id}/dashboard`);
      }
    }
  }
}
