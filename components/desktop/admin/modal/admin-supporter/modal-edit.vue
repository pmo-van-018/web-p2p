<template>
  <modal-common
    :id="MODAL.EDIT_ADMIN_SUPPORTER"
    :ref="MODAL.EDIT_ADMIN_SUPPORTER"
    :title="$t('admin_supporter.form_edit.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img :src="getIconAdminSupporter" alt="icon avatar">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group v-if="isActived" v-slot="{ ariaDescribedby }" :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <base-input-label
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
          {{ $t('role_management.label.desc_wallet_active_admin_supporter') }}
        </p>
      </b-form-group>
      <b-form-group v-else :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ adminSupporter?.walletAddress }}</p>
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
        <p class="desc-nick-name">{{ $t('role_management.label.desc_nickname_admin_supporter') }}</p>
      </b-form-group>
      <b-form-group v-else :label="$t('role_management.label.nickname')" class="mb-4 mb-md-4">
        <p class="wallet-address" :class="{'wallet-address--disable': !statusAsBoolean }">{{ adminSupporter?.nickName }}</p>
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

    <modal-confirm-change-status
      :postfix="postfix"
      :title-active="this.$t('admin_supporter.change_status.title_active')"
      :title-inactive="this.$t('admin_supporter.change_status.title_inactive')"
      :description-active="this.$t('admin_supporter.change_status.description_active')"
      :description-inactive="this.$t('admin_supporter.change_status.description_inactive')"
      :is-confirm-active="!statusAsBoolean"
      @on-confirm="handleConfirmChangeStatus"
      @on-cancel="handleCancelChangeStatus"
    />

    <modal-success-result
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/admin-supporter-succeed.svg')"
      :title="$t('admin_supporter.form_edit.title_success')"
      :description="$t('admin_supporter.form_edit.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <modal-failure-result
      is-show-old-user
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/admin-supporter-failed.svg')"
      :title="$t('admin_supporter.form_edit.title_failure')"
      :default-description="$t('admin_supporter.form_edit.description_failure')"
      :error-result="errorResult"
      :user="adminSupporter"
      @on-close="handleCloseFailedResult"
    />
    <modal-delete
      :admin-supporter="adminSupporter"
      @on-close="close"
      @on-reset="handleCloseSuccessResult"
    />
  </modal-common>
</template>
<script>
import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MODAL } from '@/resources/modal.js';
import roleManagementMixin from '@/mixins/role-management';
import { LIST_STATUS, VALIDATION_RULES } from '@/resources/role-management';
import { USER_STATUS } from '@/config/constant';
import { differenceObject } from '@/helper/difference';
import { mapActions } from 'vuex';
import { RESPONSE_ICON } from '@/resources/message'
import { ACTIVE_ADMIN_SUPPORTER_BY_ID, UPDATE_ADMIN_SUPPORTER_BY_ID, INACTIVE_ADMIN_SUPPORTER_BY_ID } from '~/api/admin-supporter'

dayjs.extend(utc);

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalConfirmChangeStatus: () => import('~/components/common/role-management/modal-confirm-change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue'),
    ModalDelete: () => import('~/components/desktop/admin/modal/admin-supporter/modal-delete.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    adminSupporter: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      VALIDATION_RULES,
      LIST_STATUS,
      walletAddress: this.adminSupporter?.walletAddress,
      nickName: this.adminSupporter?.nickName,
      contractFromElementId: 'contractFromEditModalDatePicker',
      statusAsBoolean: this.adminSupporter?.status === LIST_STATUS.ACTIVE.name,
      isLoading: false,
      errorValidation: {
        nickName: false
      },
      isVisibleEditForm: true,
      successfulResult: null,
      errorResult: null,
      isActived: false,
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
      return `_edit_${this.adminSupporter?.id || ''}`;
    },
    getIconAdminSupporter () {
      const baseUrl = '/assets/images/common/operation/';
      return this.statusAsBoolean
        ? baseUrl.concat('admin-supporter-enable.svg')
        : baseUrl.concat('admin-supporter-disable.svg')
    }
  },
  watch: {
    adminSupporter (adminSupporter) {
      this.isActived = !this.adminSupporter?.activatedAt;
      this.walletAddress = adminSupporter?.walletAddress;
      this.nickName = adminSupporter?.nickName;
      this.statusAsBoolean = adminSupporter?.status === LIST_STATUS.ACTIVE.name;
    }
  },
  methods: {
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(MODAL.EDIT_ADMIN_SUPPORTER);
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
    handleSuccessfulEditing (adminSupporter) {
      this.successfulResult = adminSupporter;
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
        const formData = {
          id: this.adminSupporter?.id,
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          status: this.status?.id
        }
        const currentAdminSupporterFormat = {
          id: this.adminSupporter?.id,
          walletAddress: this.adminSupporter?.walletAddress,
          nickName: this.adminSupporter?.nickName,
          status: LIST_STATUS[this.adminSupporter?.status]?.id
        }
        const payload = differenceObject(formData, currentAdminSupporterFormat)
        if (!payload) {
          this.handleSuccessfulEditing(this.adminSupporter);
          return
        }
        // Request to update
        let result;
        let status;
        if (this.adminSupporter?.activatedAt && payload.status) {
          if (payload.status === LIST_STATUS.ACTIVE.id) {
            result = await this.$axios.$put(ACTIVE_ADMIN_SUPPORTER_BY_ID(this.adminSupporter?.id));
            status = LIST_STATUS.ACTIVE.name;
          } else if (payload.status === LIST_STATUS.INACTIVE.id) {
            result = await this.$axios.$put(INACTIVE_ADMIN_SUPPORTER_BY_ID(this.adminSupporter?.id));
            status = LIST_STATUS.INACTIVE.name;
          }
        } else {
          result = await this.$axios.$put(UPDATE_ADMIN_SUPPORTER_BY_ID(this.adminSupporter?.id), {
            id: this.adminSupporter?.id,
            ...payload
          });
          const statusKey = Object.keys(LIST_STATUS).find(key => LIST_STATUS[key].id === formData.status)
          status = LIST_STATUS[statusKey]?.name;
        }
        // The case the result is successful
        if (isEmpty(result?.errors)) {
          const payload = {
            walletAddress: this.walletAddress,
            nickName: this.nickName,
            contractFrom: this.contractFrom,
            status,
            id: result.data.id
          }
          this.handleSuccessfulEditing(payload);
          return;
        }
        this.hideModalWhenError(result?.errors[0]?.key)
      } catch (e) {
        this.hideModalWhenError(e)
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    handleClickDelete () {
      this.toggleVisibility();
      this.$bvModal.show(MODAL.DELETE_ADMIN_SUPPORTER);
    },
    setKeyErrorPost (key) {
      const keyErrorsUpdateFail = {
        CANNOT_DISABLE_ADMIN_SUPPORTER_HAS_PENDING_APPEAL: 'CANNOT_DISABLE_ADMIN_SUPPORTER_HAS_PENDING_APPEAL'
      }
      return keyErrorsUpdateFail[key] || key
    },
    hideModalWhenError (keyError) {
      this.$bvModal.hide(MODAL.EDIT_ADMIN_SUPPORTER)
      this.showResponseModal({
        title: '',
        content: '',
        description: this.$t(`modal.message.${this.setKeyErrorPost(keyError)}`),
        icon: RESPONSE_ICON.STAFF_INACTIVE_FAILED,
        show: true
      })
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-edit.scss" />
