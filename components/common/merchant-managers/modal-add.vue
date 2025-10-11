<template>
  <ModalCommon
    :id="MODAL.ADD_MERCHANT_MANAGER"
    :ref="MODAL.ADD_MERCHANT_MANAGER"
    :title="$t('merchant_managers.form_create.title')"
    :modal-class="'modal-small modal-mobile-bottom ' + modalClassCustom"
    @hide-modal="hideModal"
  >
    <div class="modal-content mt-1 pt-md-3 grey-900 font-t14r">
      <b-form-group
        v-slot="{ ariaDescribedby }"
        :label="$t('role_management.label.wallet_address')"
        class="mb-4 mb-md-4"
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
          {{ $t('role_management.label.desc_wallet_active_manager') }}
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
        <p class="desc-nick-name">{{ $t('role_management.label.desc_nickname_manager') }}</p>
      </b-form-group>

      <b-form-group v-slot="{ ariaDescribedby }" :label="$t('role_management.label.contract_from')">
        <DatePickerInput
          v-if="$device.isDesktop"
          v-model="contractFrom"
          :aria-describedby="ariaDescribedby"
          :placeholder="$t('role_management.label.contract_from_input')"
          :default-date="contractFrom"
          icon="icon-calendar"
        />
        <div v-else class="picker-mobile">
          <p class="picker-mobile__text" @click="handleOpenContractFromCalendar">
            <span>{{ contractFrom | formatDateTime(DATE_TIME_FORMAT.DATE_VIEW) }}</span>
            <span class="icon-calendar-days" />
          </p>
          <client-only>
            <date-picker-calendar-modal
              :id="contractFromElementId"
              :date-range="{ startDate: contractFrom, endDate: contractFrom }"
              is-single-date
              :is-show-options="false"
              :is-show-date-note="false"
              :is-single-date-time-picker="true"
              :min-date="minDate"
              :max-date="maxDate"
              @on-confirm="handleConfirmContractFrom"
            />
          </client-only>
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

    <ModalSuccessResult
      is-show-contract-from
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/manager-succeed.svg')"
      :is-mobile="isMobile"
      :title="$t('merchant_managers.form_create.title_success')"
      :description="$t('merchant_managers.form_create.description_success')"
      :user="successfulResult"
      @on-close="handleCloseSuccessResult"
    />

    <ModalFailureResult
      :postfix="postfix"
      :icon="require('~imageRoot/common/operation/manager-failed.svg')"
      :title="$t('merchant_managers.form_create.title_failure')"
      :default-description="$t('merchant_managers.form_create.description_failure')"
      :error-result="errorResult"
      @on-close="handleCloseFailedResult"
    />
  </ModalCommon>
</template>
<script>
import isEmpty from 'lodash/isEmpty';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MODAL } from '@/resources/modal.js';
import { CREATE_MERCHANT_MANAGER } from '@/api/merchant-manager';
import roleManagementMixin from '@/mixins/role-management';
import { DATE_TIME_FORMAT, USER_STATUS } from '@/config/constant';
import { VALIDATION_RULES } from '@/resources/role-management';

dayjs.extend(utc);

export default {
  components: {
    ModalCommon: () => import('~/components/desktop/modal/modal-common.vue'),
    BaseInputLabel: () => import('~/components/common/base-input-label.vue'),
    DatePickerInput: () => import('~/components/common/forms/date-picker-input/index.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    DatePickerCalendarModal: () => import('~/components/mobile/modal/date-picker/index.vue'),
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
      contractFrom: dayjs().toDate(),
      contractFromElementId: 'contractFromModalDatePicker',
      statusAsBoolean: true,
      isLoading: false,
      errorValidation: {
        walletAddress: false,
        nickName: false
      },
      minDate: dayjs().subtract(20, 'year').toDate(),
      maxDate: dayjs().add(20, 'year').toDate(),
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
      this.$bvModal.hide(MODAL.ADD_MERCHANT_MANAGER);
    },
    hideModal () {
      this.walletAddress = null;
      this.nickName = null;
      this.contractFrom = dayjs().toDate();
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
    handleOpenContractFromCalendar () {
      this.$bvModal.show(this.contractFromElementId);
    },
    handleConfirmContractFrom ({ startDate, endDate }) {
      this.contractFrom = dayjs(startDate).toDate();
    },
    handleSelectContractFrom (date) {
      this.contractFrom = dayjs(date).toDate();
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
        const result = await this.$axios.$post(CREATE_MERCHANT_MANAGER, {
          walletAddress: this.walletAddress,
          nickName: this.nickName,
          contractFrom: this.contractFrom ? dayjs(this.contractFrom).format(DATE_TIME_FORMAT.DATE_ONLY) : null
        });

        // The case the result is successful
        if (!isEmpty(result?.data)) {
          const payload = {
            walletAddress: this.walletAddress,
            nickName: this.nickName,
            contractFrom: this.contractFrom,
            status: USER_STATUS.ACTIVE,
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
