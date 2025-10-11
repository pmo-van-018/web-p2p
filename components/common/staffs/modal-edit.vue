<template>
  <ModalCommon
    :id="MODAL.EDIT_STAFF"
    :ref="MODAL.EDIT_STAFF"
    :title="titleModal"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img :src="getIconStaff" alt="icon avatar">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group v-if="isActived" v-slot="{ ariaDescribedby }" :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <BaseInputLabel
          ref="walletAddress"
          v-model="walletAddress"
          name="walletAddress"
          class="input mb-0"
          class-name="wallet-address-input"
          type="text"
          required="required"
          :is-show-label="false"
          :aria-describedby="ariaDescribedby"
          :placeholder="$t('role_management.label.wallet_address_input')"
          :label="$t('role_management.label.wallet_address')"
          :label-require="$t('role_management.label.wallet_address')"
          is-wallet-address
          :error-wallet-address="$t('role_management.validation.error_wallet_address')"
          @error="handleErrorValidation"
        />
        <p v-if="statusAsBoolean" class="desc-action-status">
          <span class="desc-action-status__text"> {{ $t('role_management.label.heed') }}</span>
          {{ $t('role_management.label.desc_wallet_active_staff') }}
        </p>
      </b-form-group>
      <b-form-group v-else :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <p class="wallet-address-text">{{ staff?.walletAddress || '' }}</p>
      </b-form-group>

      <b-form-group
        v-if="isActived"
        v-slot="{ ariaDescribedby }"
        :label="$t('role_management.label.nickname')"
        class="mb-4 mb-md-4"
      >
        <BaseInputLabel
          ref="nickName"
          v-model="nickName"
          name="nickName"
          class="input mb-0"
          class-name="nickname-input"
          type="text"
          required="required"
          alpha-num
          :is-show-label="false"
          :aria-describedby="ariaDescribedby"
          :placeholder="$t('role_management.label.nickname_input')"
          :label="$t('role_management.label.nickname')"
          :label-require="$t('role_management.label.nickname')"
          :min-length="VALIDATION_RULES.MIN_LENGTH_NICKNAME"
          :max-length="VALIDATION_RULES.MAX_LENGTH_NICKNAME"
          @error="handleErrorValidation"
        />
      </b-form-group>
      <b-form-group v-else :label="$t('role_management.label.nickname')" class="mb-4 mb-md-4">
        <p class="wallet-address-text" :class="{'wallet-address-text--disable': !statusAsBoolean }">{{ staff?.nickName }}</p>
      </b-form-group>

      <b-form-group :label="$t('role_management.label.role_text')">
        <span class="wallet-address-text" :class="{'wallet-address-text--disable': !statusAsBoolean }">
          {{ convertRoleToText }}
        </span>
      </b-form-group>

      <b-form-group v-slot="{ ariaDescribedby }" :label="$t('role_management.label.status')">
        <div class="status-box d-flex align-items-start" :aria-describedby="ariaDescribedby">
          <switch-checkbox :value="statusAsBoolean" @click="handleClickStatus" />
          <span class="status-box__text ml-2 font-t12m grey-400" :class="status?.className">
            {{ status?.text }}
          </span>
        </div>
      </b-form-group>

      <div class="button-group">
        <base-button
          variants="contained"
          color="info"
          :disabled="isLoading"
          @click="handleClickDelete"
        >
          {{ $t('role_management.delete') }}
        </base-button>
        <base-button
          variants="contained"
          color="primary"
          :disabled="disabledSubmit"
          :loading="isLoading"
          @click="handleSubmit"
        >
          {{ $t('role_management.modal.save') }}
        </base-button>
      </div>
    </div>

    <ModalConfirmChangeStatus
      :postfix="postfix"
      :title-active="getTitleActiveStaff"
      :title-inactive="getTitleInactiveStaff"
      :description-active="getDescriptionActiveStaff"
      :description-inactive="getDescriptionInactiveStaff"
      :is-confirm-active="!statusAsBoolean"
      @on-confirm="handleConfirmChangeStatus"
      @on-cancel="handleCancelChangeStatus"
    />

    <ModalSuccessResult
      :postfix="postfix"
      :icon="isSupporter ? require('~imageRoot/common/operation/supporter-succeed.svg') : require('~imageRoot/common/operation/operator-succeed.svg')"
      :title="$t('staffs.form_edit.title_success')"
      :description="$t('staffs.form_edit.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      is-show-old-user
      :postfix="postfix"
      :icon="isSupporter ? require('~imageRoot/common/operation/supporter-failed.svg') : require('~imageRoot/common/operation/operator-failed.svg')"
      :title="$t('staffs.form_edit.title_failure')"
      :default-description="$t('staffs.form_edit.description_failure')"
      :error-result="errorResult"
      :user="staff"
      @on-close="handleCloseFailedResult"
    />

    <ModalDelete
      :staff="staff"
      @on-close="close"
      @on-reset="handleCloseSuccessResult"
    />
  </ModalCommon>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { UPDATE_STAFF, ACTIVE_STAFF_BY_ID, INACTIVE_STAFF_BY_ID } from '@/api/staff';
import roleManagementMixin from '@/mixins/role-management';
import { LIST_STATUS, VALIDATION_RULES } from '@/resources/role-management';
import { differenceObject } from '@/helper/difference';
import { DATE_TIME_FORMAT, USER_ROLE, USER_ROLE_CODE, USER_ROLE_STRING } from '@/config/constant';
import { mapActions } from 'vuex';
import { RESPONSE_ICON } from '@/resources/message'

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalConfirmChangeStatus: () => import('~/components/common/role-management/modal-confirm-change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue'),
    ModalDelete: () => import('~/components/common/staffs/modal-delete.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    staff: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      VALIDATION_RULES,
      LIST_STATUS,
      DATE_TIME_FORMAT,
      walletAddress: this.staff?.walletAddress,
      nickName: this.staff?.nickName,
      statusAsBoolean: this.staff?.status === LIST_STATUS.ACTIVE.name,
      isLoading: false,
      errorValidation: {
        nickName: false
      },
      isVisibleEditForm: true,
      successfulResult: null,
      errorResult: null,
      isActived: false,
      roleCodes: USER_ROLE_CODE,
      roleCodeSelected: USER_ROLE_CODE[this.staff?.type],
      USER_ROLE_STRING
    };
  },
  computed: {
    USER_ROLE () {
      return USER_ROLE
    },
    hasError () {
      return this.$_roleManagementMixin_hasFormError(this.errorValidation);
    },
    disabledSubmit () {
      const emptyRequiredFields = !this.nickName;
      return this.isLoading || this.hasError || emptyRequiredFields;
    },
    status () {
      return this.$_roleManagementMixin_getStatus(this.statusAsBoolean);
    },
    modalClassCustom () {
      return this.$_roleManagementMixin_getModalClassCustom(this.isVisibleEditForm);
    },
    postfix () {
      return `_edit_${this.staff?.id || ''}`;
    },
    getTitleActiveStaff () {
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return this.$t('staffs.change_status.title_active.merchant_operator')
      }
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return this.$t('staffs.change_status.title_active.merchant_supporter')
      }
      return ''
    },
    getTitleInactiveStaff () {
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return this.$t('staffs.change_status.title_inactive.merchant_operator')
      }
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return this.$t('staffs.change_status.title_inactive.merchant_supporter')
      }
      return ''
    },
    getDescriptionActiveStaff () {
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return this.$t('staffs.change_status.description_active.merchant_operator')
      }
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return this.$t('staffs.change_status.description_active.merchant_supporter')
      }
      return ''
    },
    getDescriptionInactiveStaff () {
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_OPERATOR) {
        return this.$t('staffs.change_status.description_inactive.merchant_operator')
      }
      if (this.roleCodeSelected === USER_ROLE_CODE.MERCHANT_SUPPORTER) {
        return this.$t('staffs.change_status.description_inactive.merchant_supporter')
      }
      return ''
    },
    getIconStaff () {
      return this.$_roleManagementMixin_getIconByStaffRole(this.staff?.type, this.statusAsBoolean)
    },
    convertRoleToText () {
      return this.$_roleManagementMixin_convertRoleToText(this.staff?.type)
    },
    isSupporter () {
      return this.staff?.type === USER_ROLE.MERCHANT_SUPPORTER
    },
    titleModal () {
      return this.isSupporter
        ? this.$t('staffs.form_edit.title_supporter')
        : this.$t('staffs.form_edit.title')
    }
  },
  watch: {
    staff (staff) {
      this.walletAddress = staff?.walletAddress;
      this.nickName = staff?.nickName;
      this.statusAsBoolean = staff?.status === LIST_STATUS.ACTIVE.name;
      this.isActived = !staff?.activatedAt;
      this.roleCodeSelected = USER_ROLE_CODE[staff?.type];
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(MODAL.EDIT_STAFF);
    },
    hideModal () {
      this.walletAddress = null;
      this.nickName = null;
      this.statusAsBoolean = true;
      this.errorValidation = {
        nickName: false
      };
      this.isVisibleEditForm = true;
      this.successfulResult = null;
      this.errorResult = null;

      this.$emit('on-close');
    },
    toggleVisibility () {
      this.isVisibleEditForm = !this.isVisibleEditForm;
    },
    handleSuccessfulEditing (staff) {
      this.successfulResult = staff;
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.SUCCESS_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    handleCloseSuccessResult () {
      this.$emit('on-reset');
      this.close();
    },
    handleCloseFailedResult () {
      this.toggleVisibility();
    },
    handleFailedEditing (errorResult) {
      this.errorResult = errorResult;
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.FAILURE_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    handleClickStatus (statusAsBoolean) {
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT, this.postfix);
    },
    handleConfirmChangeStatus () {
      this.toggleVisibility();
      this.$_roleManagementMixin_hideChildModal(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT, this.postfix);
      this.statusAsBoolean = !this.statusAsBoolean;
    },
    handleCancelChangeStatus () {
      this.toggleVisibility();
      this.$_roleManagementMixin_hideChildModal(MODAL.CONFIRM_CHANGE_STATUS_ROLE_MANAGEMENT, this.postfix);
    },
    handleErrorValidation (errorValidation) {
      if (!errorValidation?.name) {
        return;
      }

      this.errorValidation = {
        ...this.errorValidation,
        [errorValidation.name]: errorValidation.error
      };
    },
    async handleSubmit () {
      try {
        this.isLoading = true;
        const formData = {
          id: this.staff?.id,
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          status: this.status?.id,
          type: this.roleCodeSelected
        }
        const currentStaffFormat = {
          id: this.staff?.id,
          walletAddress: this.staff?.walletAddress,
          nickName: this.staff?.nickName,
          status: LIST_STATUS[this.staff?.status]?.id,
          type: USER_ROLE_CODE[this.staff?.type]
        }
        const payload = differenceObject(formData, currentStaffFormat)
        if (!payload) {
          this.handleSuccessfulEditing(this.staff);
          return
        }
        // Request to update
        let result;
        let statusName = '';
        if (this.staff?.activatedAt && payload.status) {
          if (payload.status === LIST_STATUS.ACTIVE.id) {
            result = await this.$axios.$put(ACTIVE_STAFF_BY_ID?.(this.staff?.id));
            statusName = LIST_STATUS.ACTIVE.name;
          } else if (payload.status === LIST_STATUS.INACTIVE.id) {
            result = await this.$axios.$put(INACTIVE_STAFF_BY_ID?.(this.staff?.id));
            statusName = LIST_STATUS.INACTIVE.name;
          }
        } else {
          result = await this.$axios.$put(UPDATE_STAFF(this.staff?.id), {
            id: this.staff?.id,
            ...payload
          });
          const statusKey = Object.keys(LIST_STATUS).find(key => LIST_STATUS[key].id === formData.status)
          statusName = LIST_STATUS[statusKey]?.name;
        }
        if (result.errors?.length) {
          this.hideModalWhenError(result.errors[0].key)
          return;
        }
        // The case the result is successful
        const data = {
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          status: statusName,
          id: this.staff.id
        }
        this.handleSuccessfulEditing(data);
      } catch (e) {
        const keyError = e.response?.data?.errors[0]?.key || 'error_system'
        this.hideModalWhenError(keyError)
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    handleClickDelete () {
      this.toggleVisibility();
      this.$bvModal.show(MODAL.DELETE_STAFF);
    },
    disabledRole (role) {
      return role !== this.roleCodeSelected;
    },
    setKeyErrorPost (key) {
      const keyErrorsUpdateFail = {
        CANNOT_DISABLE_OPERATOR_HAS_PENDING_ORDER: 'CANNOT_DISABLE_OPERATOR_HAS_PENDING_ORDER'
      }
      return keyErrorsUpdateFail[key] || key
    },
    hideModalWhenError (keyError) {
      if (keyError === 'NICKNAME_IS_EXISTED') {
        this.$bvModal.hide(MODAL.EDIT_STAFF)
        this.showResponseModal({
          description: this.$t('modal.message.NICKNAME_IS_EXISTED'),
          icon: RESPONSE_ICON.STAFF_INACTIVE_FAILED,
          show: true
        });
      } else {
        this.handleFailedEditing(keyError)
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-edit.scss" />
