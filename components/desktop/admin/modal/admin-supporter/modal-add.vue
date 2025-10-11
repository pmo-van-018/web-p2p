<template>
  <modal-common
    :id="MODAL.ADD_ADMIN_SUPPORTER"
    :ref="MODAL.ADD_ADMIN_SUPPORTER"
    :title="$t('admin_supporter.form_create.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img :src="require('~imageRoot/common/operation/admin-supporter-enable.svg')" alt="icon avatar">
    </div>
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group
        v-slot="{ ariaDescribedby }"
        :label="$t('role_management.label.wallet_address')"
        class="mb-4 mb-md-4"
      >
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

      <b-form-group v-slot="{ ariaDescribedby }" :label="$t('role_management.label.status')">
        <div class="status-box d-flex align-items-start" :aria-describedby="ariaDescribedby">
          <switch-checkbox :value="statusAsBoolean" is-toggle @click="handleChangeStatus" />
          <span class="status-box__text ml-2 font-t12m grey-400" :class="status?.className">
            {{ status?.text }}
          </span>
        </div>
      </b-form-group>

      <base-button
        variants="contained"
        color="primary"
        :disabled="disabledSubmit"
        :loading="isLoading"
        full-width
        @click="handleSubmit"
      >
        {{ $t('role_management.modal.save') }}
      </base-button>
    </div>

    <modal-success-result
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/admin-supporter-succeed.svg')"
      :is-mobile="isMobile"
      :title="$t('admin_supporter.form_create.title_success')"
      :description="$t('admin_supporter.form_create.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <modal-failure-result
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/admin-supporter-failed.svg')"
      :title="$t('admin_supporter.form_create.title_failure')"
      :default-description="$t('admin_supporter.form_create.description_failure')"
      :error-result="errorResult"
      @on-close="handleCloseFailedResult"
    />
  </modal-common>
</template>
<script>
import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MODAL } from '@/resources/modal.js';
import roleManagementMixin from '@/mixins/role-management';
import { DATE_TIME_FORMAT } from '@/config/constant';
import { VALIDATION_RULES } from '@/resources/role-management';
import { CREATE_ADMIN_SUPPORTER } from '@/api/admin-supporter'

dayjs.extend(utc);

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    SwitchCheckbox: () => import('~/components/common/forms/switch-checkbox/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    ModalSuccessResult: () => import('~/components/common/role-management/modal-success.vue'),
    ModalFailureResult: () => import('~/components/common/role-management/modal-failure.vue')
  },
  mixins: [roleManagementMixin],
  props: {
    onSuccess: {
      type: Function,
      default: () => {}
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      MODAL,
      VALIDATION_RULES,
      DATE_TIME_FORMAT,
      walletAddress: null,
      nickName: null,
      statusAsBoolean: true,
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
    status () {
      return this.$_roleManagementMixin_getStatus(this.statusAsBoolean);
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
      this.$bvModal.hide(MODAL.ADD_ADMIN_SUPPORTER);
    },
    hideModal () {
      this.walletAddress = null;
      this.nickName = null;
      this.statusAsBoolean = true;
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
    handleSuccessfulCreating (adminSupporter) {
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
    handleFailedCreating (errorResult) {
      this.errorResult = errorResult;
      this.toggleVisibility();
      this.$_roleManagementMixin_showChildModal(MODAL.FAILURE_RESULT_ROLE_MANAGEMENT, this.postfix);
    },
    handleChangeStatus (statusAsBoolean) {
      this.statusAsBoolean = statusAsBoolean;
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
        const result = await this.$axios.$post(CREATE_ADMIN_SUPPORTER, {
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          status: this.status?.id
        });
        // The case the result is successful
        if (!isEmpty(result?.data)) {
          const payload = {
            walletAddress: this.walletAddress,
            nickName: this.nickName,
            status: this.status?.name,
            id: result.data.id
          }
          this.handleSuccessfulCreating(payload);
          return;
        }

        // The case the result is failed
        this.handleFailedCreating(result.errors[0]?.key);
      } catch (e) {
        const keyError = e.response?.data?.errors[0]?.key || 'error_system'
        this.handleFailedCreating(keyError);
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-add.scss" />
