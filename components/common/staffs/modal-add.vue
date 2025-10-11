<template>
  <ModalCommon
    :id="MODAL.ADD_STAFF"
    :ref="MODAL.ADD_STAFF"
    :title="getTitleStaff"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="staff-avatar">
      <img :src="getIconStaff" alt="icon avatar" width="105">
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
        <p v-if="statusAsBoolean" class="desc-action-status">
          <span class="desc-action-status__text"> {{ $t('role_management.label.heed') }}</span>
          {{ $t('role_management.label.desc_wallet_active_staff') }}
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
        <p class="desc-nick-name">{{ $t('role_management.label.desc_nickname_staff') }}</p>
      </b-form-group>

      <b-form-group v-slot="{ ariaDescribedby }" :label="$t('role_management.label.status')">
        <div class="status-box d-flex align-items-start" :aria-describedby="ariaDescribedby">
          <switch-checkbox :value="statusAsBoolean" is-toggle @click="handleChangeStatus" />
          <span class="status-box__text ml-2 font-t12m grey-400" :class="status?.className">
            {{ status?.text }}
          </span>
        </div>
      </b-form-group>
      <div class="btn-group">
        <base-button
          variants="outlined"
          color="grey"
          @click="previousModal()"
        >
          {{ $t('not_found.button_back') }}
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

    <ModalSuccessResult
      :postfix="postfix"
      :icon="isSupporter ? require('~imageRoot/common/operation/supporter-succeed.svg') : require('~imageRoot/common/operation/operator-succeed.svg')"
      :title="$t('staffs.form_create.title_success')"
      :description="$t('staffs.form_create.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      :postfix="postfix"
      :icon="isSupporter ? require('~imageRoot/common/operation/supporter-failed.svg') : require('~imageRoot/common/operation/operator-failed.svg')"
      :title="$t('staffs.form_create.title_failure')"
      :default-description="$t('staffs.form_create.description_failure')"
      :error-result="errorResult"
      @on-close="handleCloseFailedResult"
    />
  </ModalCommon>
</template>
<script>
import isEmpty from 'lodash/isEmpty';
import { MODAL } from '@/resources/modal.js';
import { STAFF } from '@/api/staff';
import roleManagementMixin from '@/mixins/role-management';
import { DATE_TIME_FORMAT, USER_ROLE_CODE, USER_ROLE } from '@/config/constant';
import { VALIDATION_RULES } from '@/resources/role-management';

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
    selectedRoleValue: {
      type: String,
      default: ''
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
      errorResult: null,
      roleCodes: USER_ROLE_CODE,
      roleCodeSelected: USER_ROLE_CODE.MERCHANT_OPERATOR
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
    isSupporter () {
      return this.selectedRoleValue === USER_ROLE.MERCHANT_SUPPORTER
    },
    status () {
      return this.$_roleManagementMixin_getStatus(this.statusAsBoolean);
    },
    convertRoleCodeSelected () {
      return USER_ROLE_CODE[this.selectedRoleValue]
    },
    modalClassCustom () {
      return this.$_roleManagementMixin_getModalClassCustom(this.isVisibleCreateForm);
    },
    postfix () {
      return '_create';
    },
    getIconStaff () {
      return this.$_roleManagementMixin_getIconByStaffRole(this.selectedRoleValue, this.statusAsBoolean)
    },
    getTitleStaff () {
      if (this.selectedRoleValue === USER_ROLE.MERCHANT_OPERATOR) {
        return this.$t('staffs.form_create.title_operator')
      } else if (this.selectedRoleValue === USER_ROLE.MERCHANT_SUPPORTER) {
        return this.$t('staffs.form_create.title_supporter')
      }
      return null
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.ADD_STAFF);
    },
    previousModal () {
      this.$bvModal.hide(MODAL.ADD_STAFF);
      this.$bvModal.show(MODAL.SELECT_STAFF_TYPE);
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
    handleSuccessfulCreating (merchantManager) {
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
        const result = await this.$axios.$post(STAFF, {
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          status: this.status?.id,
          type: this.convertRoleCodeSelected
        });

        // The case the result is successful
        if (isEmpty(result?.errors)) {
          const payload = {
            walletAddress: this.walletAddress,
            nickName: this.nickName,
            contractFrom: this.contractFrom,
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
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/role-management/modal-add.scss" />
