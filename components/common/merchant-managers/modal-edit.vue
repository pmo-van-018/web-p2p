<template>
  <ModalCommon
    :id="MODAL.EDIT_MERCHANT_MANAGER"
    :ref="MODAL.EDIT_MERCHANT_MANAGER"
    :title="$t('merchant_managers.form_edit.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img :src="getIconManager" alt="icon avatar">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ merchantManager?.walletAddress }}</p>
      </b-form-group>

      <b-form-group :label="$t('role_management.label.nickname')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ merchantManager?.nickName }}</p>
      </b-form-group>

      <b-form-group :label="$t('role_management.label.contract_from')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ merchantManager?.contractFrom | formatDateTime(DATE_FORMAT) }}</p>
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
      :title-active="this.$t('merchant_managers.change_status.title_active')"
      :title-inactive="this.$t('merchant_managers.change_status.title_inactive')"
      :description-active="this.$t('merchant_managers.change_status.description_active')"
      :description-inactive="this.$t('merchant_managers.change_status.description_inactive')"
      :is-confirm-active="!statusAsBoolean"
      @on-confirm="handleConfirmChangeStatus"
      @on-cancel="handleCancelChangeStatus"
    />

    <ModalSuccessResult
      is-show-contract-from
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/manager-succeed.svg')"
      :title="$t('merchant_managers.form_edit.title_success')"
      :description="$t('merchant_managers.form_edit.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      is-show-old-user
      is-show-contract-from
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/manager-failed.svg')"
      :title="$t('merchant_managers.form_edit.title_failure')"
      :default-description="$t('merchant_managers.form_edit.description_failure')"
      :error-result="errorResult"
      :user="merchantManager"
      @on-close="handleCloseFailedResult"
    />

    <ModalDelete
      :merchant-manager="merchantManager"
      @on-close="close"
      @on-reset="handleCloseSuccessResult"
    />
  </ModalCommon>
</template>
<script>
import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MODAL } from '@/resources/modal.js';
import { ACTIVE_MERCHANT_MANAGER_BY_ID, INACTIVE_MERCHANT_MANAGER_BY_ID } from '@/api/merchant-manager';
import roleManagementMixin from '@/mixins/role-management';
import { LIST_STATUS, VALIDATION_RULES } from '@/resources/role-management';
import { DATE_TIME_FORMAT, DATE_FORMAT, USER_STATUS } from '@/config/constant';
import { mapActions } from 'vuex';
import { ERROR_TYPE } from '@/resources/message';

dayjs.extend(utc);

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalConfirmChangeStatus: () => import('~/components/common/role-management/modal-confirm-change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue'),
    ModalDelete: () => import('~/components/common/merchant-managers/modal-delete.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    merchantManager: {
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
      walletAddress: this.merchantManager?.walletAddress,
      nickName: this.merchantManager?.nickName,
      contractFrom: this.merchantManager?.contractFrom ? dayjs(this.merchantManager?.contractFrom).toDate() : null,
      contractFromElementId: 'contractFromEditModalDatePicker',
      statusAsBoolean: this.merchantManager?.status === LIST_STATUS.ACTIVE.name,
      isLoading: false,
      errorValidation: {
        nickName: false
      },
      minDate: dayjs().subtract(20, 'year').toDate(),
      maxDate: dayjs().add(20, 'year').toDate(),
      isVisibleEditForm: true,
      successfulResult: null,
      errorResult: null,
      DATE_FORMAT,
      USER_STATUS
    };
  },
  computed: {
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
      return `_edit_${this.merchantManager?.id || ''}`;
    },
    getIconManager () {
      const baseUrl = '/assets/images/common/operation/';
      return this.statusAsBoolean
        ? baseUrl.concat('manager-enable.svg')
        : baseUrl.concat('manager-disable.svg')
    }
  },
  watch: {
    merchantManager (merchantManager) {
      this.walletAddress = merchantManager?.walletAddress;
      this.nickName = merchantManager?.nickName;
      this.contractFrom = merchantManager?.contractFrom ? dayjs(merchantManager?.contractFrom).toDate() : null;
      this.statusAsBoolean = merchantManager?.status === LIST_STATUS.ACTIVE.name;
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    close () {
      this.$bvModal.hide(MODAL.EDIT_MERCHANT_MANAGER);
    },
    hideModal () {
      this.walletAddress = null;
      this.nickName = null;
      this.contractFrom = dayjs().toDate();
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
    handleSuccessfulEditing (merchantManager) {
      this.successfulResult = merchantManager;
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
    handleOpenContractFromCalendar () {
      this.$bvModal.show(this.contractFromElementId);
    },
    handleConfirmContractFrom ({ startDate, endDate }) {
      this.contractFrom = dayjs(startDate).toDate();
    },
    handleSelectContractFrom (date) {
      this.contractFrom = dayjs(date).toDate();
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
        // Request to update
        let result;
        let status;
        if (this.status?.id !== LIST_STATUS[this.merchantManager?.status]?.id) {
          if (this.status?.id === LIST_STATUS.ACTIVE.id) {
            status = LIST_STATUS.ACTIVE.name
            result = await this.$axios.$put(ACTIVE_MERCHANT_MANAGER_BY_ID(this.merchantManager?.id));
          } else if (this.status?.id === LIST_STATUS.INACTIVE.id) {
            status = LIST_STATUS.INACTIVE.name
            result = await this.$axios.$put(INACTIVE_MERCHANT_MANAGER_BY_ID(this.merchantManager?.id));
          }
        } else {
          this.handleSuccessfulEditing(this.merchantManager);
          return
        }
        // The case the result is successful
        if (isEmpty(result?.errors)) {
          const payload = {
            walletAddress: this.walletAddress,
            nickName: this.nickName,
            contractFrom: this.contractFrom,
            status,
            id: this.merchantManager?.id
          }
          this.handleSuccessfulEditing(payload);
          return;
        }
        this.hideModalWhenError(result?.errors[0]?.key)
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
      this.$bvModal.show(MODAL.DELETE_MERCHANT_MANAGER);
    },
    setKeyErrorPost (key) {
      const keyErrorsUpdateFail = {
        CANNOT_DISABLE_MANAGER_HAS_PENDING_ORDER: 'CANNOT_DISABLE_MANAGER_HAS_PENDING_ORDER'
      }
      return keyErrorsUpdateFail[key] || key
    },
    hideModalWhenError (keyError) {
      this.$bvModal.hide(MODAL.EDIT_MERCHANT_MANAGER)
      this.initModal({
        type: ERROR_TYPE.MANUAL,
        message: [{ key: this.setKeyErrorPost(keyError) }],
        api: '/admin/inactive-manager',
        isShow: true
      })
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-edit.scss" />
