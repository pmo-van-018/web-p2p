<template>
  <ModalCommon
    :id="MODAL.EDIT_SUPPER_ADMIN"
    :ref="MODAL.EDIT_SUPPER_ADMIN"
    :title="$t('admin.form_edit.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img src="/assets/images/common/operation/supper-admin.svg" alt="icon avatar" width="120" height="120">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group :label="$t('role_management.label.wallet_address')" class="mb-4 mb-md-4">
        <p class="wallet-address-text wallet-address-text--disable">{{ currentItem?.walletAddress || '' }}</p>
      </b-form-group>

      <b-form-group :label="$t('role_management.label.nickname')" class="mb-4 mb-md-4">
        <p class="wallet-address-text wallet-address-text--disable">{{ currentItem?.nickName }}</p>
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
          :disabled="isLoading"
          :loading="isLoading"
          @click="handleSubmit"
        >
          {{ $t('role_management.modal.save') }}
        </base-button>
      </div>
    </div>

    <ModalConfirmChangeStatus
      :postfix="postfix"
      :title-active="$t('admin.form_edit.active.content')"
      :title-inactive="$t('admin.form_edit.inactive.content')"
      image-active="/assets/images/common/operation/supper-admin-active.svg"
      image-inactive="/assets/images/common/operation/supper-admin-inactive.svg"
      :description-active="$t('admin.form_edit.active.desc')"
      :description-inactive="$t('admin.form_edit.inactive.desc')"
      :is-confirm-active="!statusAsBoolean"
      @on-confirm="handleConfirmChangeStatus"
      @on-cancel="handleCancelChangeStatus"
    />

    <ModalSuccessResult
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/supper-admin-succeed.svg')"
      :title="titleEditModal"
      :description="$t('staffs.form_edit.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      is-show-old-user
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/supper-admin-failed.svg')"
      :title="titleEditModal"
      :default-description="$t('staffs.form_edit.description_failure')"
      :error-result="errorResult"
      :user="currentItem"
      @on-close="handleCloseFailedResult"
    />

    <ModalDelete
      :current-item="currentItem"
      @on-close="close"
      @on-reset="handleCloseSuccessResult"
    />
  </ModalCommon>
</template>
<script>
import { MODAL } from '@/resources/modal.js';
import { SYSTEM_ADMIN_API } from '@/api/system-admin';
import roleManagementMixin from '@/mixins/role-management';
import { USER_STATUS } from '@/config/constant';
import { mapActions } from 'vuex';
import { RESPONSE_ICON } from '@/resources/message'

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalConfirmChangeStatus: () => import('~/components/common/role-management/modal-confirm-change-status.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue'),
    ModalDelete: () => import('~/components/desktop/system-admin/admins/modal-delete.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    currentItem: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      walletAddress: this.currentItem?.walletAddress,
      nickName: this.currentItem?.nickName,
      statusAsBoolean: this.currentItem?.status === USER_STATUS.ACTIVE,
      isLoading: false,
      isVisibleEditForm: true,
      successfulResult: null,
      errorResult: null
    };
  },
  computed: {
    status () {
      return this.$_roleManagementMixin_getStatus(this.statusAsBoolean);
    },
    modalClassCustom () {
      return this.$_roleManagementMixin_getModalClassCustom(this.isVisibleEditForm);
    },
    postfix () {
      return `_edit_${this.currentItem?.walletAddress || ''}`;
    },
    titleEditModal () {
      return this.successfulResult?.status === USER_STATUS.ACTIVE ? this.$t('admin.form_edit.active.content') : this.$t('admin.form_edit.inactive.content')
    }
  },
  watch: {
    currentItem (item) {
      this.walletAddress = item?.walletAddress;
      this.nickName = item?.nickName;
      this.statusAsBoolean = item?.status === USER_STATUS.ACTIVE;
    }
  },
  methods: {
    ...mapActions('modal-message', ['initModal']),
    ...mapActions('modal-response', ['showResponseModal']),
    close () {
      this.$bvModal.hide(MODAL.EDIT_SUPPER_ADMIN);
    },
    hideModal () {
      this.walletAddress = null;
      this.nickName = null;
      this.statusAsBoolean = true;
      this.isVisibleEditForm = true;
      this.successfulResult = null;
      this.errorResult = null;

      this.$emit('on-close');
    },
    toggleVisibility () {
      this.isVisibleEditForm = !this.isVisibleEditForm;
    },
    handleSuccessfulEditing (item) {
      this.successfulResult = item;
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
    async handleSubmit () {
      try {
        this.isLoading = true;
        let result;
        let statusName = '';
        if (this.statusAsBoolean) {
          result = await this.$axios.$put(SYSTEM_ADMIN_API.ACTIVE_SUPPER_ADMIN_BY_ID?.(this.currentItem?.id));
          statusName = USER_STATUS.ACTIVE;
        } else {
          result = await this.$axios.$put(SYSTEM_ADMIN_API.INACTIVE_SUPPER_ADMIN_BY_ID?.(this.currentItem?.id));
          statusName = USER_STATUS.INACTIVE;
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
          id: this.currentItem.id
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
      this.$bvModal.show(MODAL.DELETE_SUPPER_ADMIN);
    },
    hideModalWhenError (keyError) {
      if (keyError === 'SUPER_ADMIN_NOT_FOUND') {
        this.$bvModal.hide(MODAL.EDIT_SUPPER_ADMIN)
        this.showResponseModal({
          description: this.$t('modal.message.SUPER_ADMIN_NOT_FOUND'),
          icon: RESPONSE_ICON.SUPPER_ADMIN_FAILED,
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
