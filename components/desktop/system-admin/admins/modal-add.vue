<template>
  <ModalCommon
    :id="MODAL.ADD_SUPPER_ADMIN"
    :ref="MODAL.ADD_SUPPER_ADMIN"
    :title="$t('admin.form_add.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img src="/assets/images/common/operation/supper-addmin-created.svg" alt="icon avatar" width="120" height="120">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group
        v-slot="{ ariaDescribedby }"
        :label="$t('role_management.label.wallet_address')"
      >
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
        <p class="desc-action-status">
          <span class="desc-action-status__text"> {{ $t('role_management.label.heed') }}</span>
          {{ $t('role_management.label.desc_wallet_active_supper_admin') }}
        </p>
      </b-form-group>

      <b-form-group
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
          alpha-num-underscore-and-minus
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

      <base-button
        variants="contained"
        color="primary"
        full-width
        :disabled="disabledSubmit"
        :loading="isLoading"
        @click="handleSubmit"
      >
        {{ $t('role_management.modal.save') }}
      </base-button>
    </div>

    <ModalSuccessResult
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/supper-admin-succeed.svg')"
      :title="$t('admin.form_add.title_succeed')"
      :description="$t('staffs.form_edit.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/supper-admin-failed.svg')"
      :title="$t('admin.form_add.title_failure')"
      :default-description="$t('staffs.form_edit.description_failure')"
      :error-result="errorResult"
      @on-close="handleCloseFailedResult"
    />
  </ModalCommon>
</template>
<script>
import isEmpty from 'lodash/isEmpty';
import { MODAL } from '@/resources/modal.js';
import { SYSTEM_ADMIN_API } from '@/api/system-admin';
import roleManagementMixin from '@/mixins/role-management';
import { VALIDATION_RULES } from '@/resources/role-management';
import { USER_STATUS } from '@/config/constant';

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    onSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      VALIDATION_RULES,
      walletAddress: null,
      nickName: null,
      isLoading: false,
      errorValidation: {
        walletAddress: false,
        nickName: false
      },
      isVisibleCreateForm: true,
      successfulResult: null,
      errorResult: null
    }
  },
  computed: {
    hasError () {
      return this.$_roleManagementMixin_hasFormError(this.errorValidation);
    },
    disabledSubmit () {
      const emptyRequiredFields = !this.walletAddress || !this.nickName;
      return this.hasError || emptyRequiredFields;
    },
    modalClassCustom () {
      return this.$_roleManagementMixin_getModalClassCustom(this.isVisibleCreateForm);
    },
    postfix () {
      return '_create';
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.ADD_SUPPER_ADMIN);
    },
    hideModal () {
      this.walletAddress = null;
      this.nickName = null;
      this.errorValidation = {
        walletAddress: false,
        nickName: false
      };
      this.isVisibleCreateForm = true;
      this.successfulResult = null;
      this.errorResult = null;
    },
    toggleVisibility () {
      this.isVisibleCreateForm = !this.isVisibleCreateForm;
    },
    handleSuccessfulCreating (item) {
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
    handleFailedCreating (errorResult) {
      this.errorResult = errorResult;
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.FAILURE_RESULT_ROLE_MANAGEMENT, this.postfix);
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
        // Request to create
        const result = await this.$axios.$post(SYSTEM_ADMIN_API.CREATE, {
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          status: this.status?.id
        });

        // The case the result is successful
        if (isEmpty(result?.errors)) {
          const payload = {
            walletAddress: this.walletAddress,
            nickName: this.nickName,
            status: USER_STATUS.ACTIVE,
            id: result.data.id
          }
          this.handleSuccessfulCreating(payload);
          return;
        }

        this.handleFailedCreating(result.errors[0]?.key);
      } catch (e) {
        const keyError = e.response?.data?.errors[0]?.key || 'error_system'
        this.handleFailedCreating(keyError);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-add.scss" />
