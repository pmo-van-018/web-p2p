<template>
  <ModalCommon
    :id="MODAL.SETTING_OTHERS"
    :ref="MODAL.SETTING_OTHERS"
    :title="$t('merchant.settings.other.title')"
    modal-class="modal-mobile-bottom"
    @hide-modal="hideModal"
  >
    <div class="modal-content pt-md-3 grey-900 font-t14r">
      <p class="modal-content__desc mt-3 pb-1">{{ $t('merchant.settings.other.description') }}</p>

      <div class="form">
        <div class="form__item">
          <div class="form__title">
            {{ $t('merchant.settings.other.label.user_payment_limit') }}
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="userPaymentMethodsLimit"
              v-model="userPaymentMethodsLimit"
              name="userPaymentMethodsLimit"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT"
              :max-value="MAX_PAYMENT_METHOD_LIMIT"
              :limit-input="MAX_PAYMENT_METHOD_LIMIT.length"
              :is-show-label="false"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_PAYMENT_METHOD_LIMIT)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_PAYMENT_METHOD_LIMIT)"
              :label="$t('merchant.settings.other.label.user_payment_limit')"
              :error-required="$t('merchant.settings.other.label.payment_limit_required')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>

        <div class="form__item">
          <div class="form__title">
            {{ $t('merchant.settings.other.label.manager_payment_limit') }}
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="managerPaymentMethodsLimit"
              v-model="managerPaymentMethodsLimit"
              name="managerPaymentMethodsLimit"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT"
              :max-value="MAX_PAYMENT_METHOD_LIMIT"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_PAYMENT_METHOD_LIMIT)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_PAYMENT_METHOD_LIMIT)"
              :limit-input="MAX_PAYMENT_METHOD_LIMIT.length"
              :is-show-label="false"
              :label="$t('merchant.settings.other.label.manager_payment_limit')"
              :error-required="$t('merchant.settings.other.label.payment_limit_required')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>

        <div class="form__item">
          <div class="form__title">
            {{ $t('merchant.settings.other.label.received_by_supporter_limit') }}
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="appealReceivedBySupporterLimit"
              v-model="appealReceivedBySupporterLimit"
              name="appealReceivedBySupporterLimit"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT"
              :max-value="MAX_APPEAL_RECEIVE_LIMIT"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_APPEAL_RECEIVE_LIMIT)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_APPEAL_RECEIVE_LIMIT)"
              :limit-input="MAX_APPEAL_RECEIVE_LIMIT.length"
              :is-show-label="false"
              :label="$t('merchant.settings.other.label.received_by_supporter_limit')"
              :error-required="$t('merchant.settings.other.label.received_by_supporter_limit_required')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>

        <div class="form__item">
          <div class="form__title">
            {{ $t('merchant.settings.other.label.received_by_admin_supporter_limit') }}
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="appealReceivedByAdminSupporterLimit"
              v-model="appealReceivedByAdminSupporterLimit"
              name="appealReceivedByAdminSupporterLimit"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT"
              :max-value="MAX_APPEAL_RECEIVE_LIMIT"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_APPEAL_RECEIVE_LIMIT)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_APPEAL_RECEIVE_LIMIT)"
              :limit-input="MAX_APPEAL_RECEIVE_LIMIT.length"
              :is-show-label="false"
              :label="$t('merchant.settings.other.label.received_by_admin_supporter_limit')"
              :error-required="$t('merchant.settings.other.label.received_by_admin_supporter_limit_required')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>

        <div class="form__item">
          <div class="form__title">
            {{ $t('merchant.settings.other.label.support_requests_receiving_limit') }}
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="supportRequestsReceivingLimit"
              v-model="supportRequestsReceivingLimit"
              name="supportRequestsReceivingLimit"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT"
              :max-value="MAX_SUPPORT_REQUEST_LIMIT"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_SUPPORT_REQUEST_LIMIT)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SETTING_LIMIT, MAX_SUPPORT_REQUEST_LIMIT)"
              :limit-input="MAX_SUPPORT_REQUEST_LIMIT.length"
              :is-show-label="false"
              :label="$t('merchant.settings.other.label.support_requests_receiving_limit')"
              :error-required="$t('merchant.settings.other.label.support_requests_receiving_limit_required')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>
      </div>

      <base-button
        variants="contained"
        color="primary"
        :disabled="disabledSubmit"
        :loading="isLoading"
        @click="handleSubmit"
      >
        {{ $t('merchant.settings.limit_fee_time.modal.button') }}
      </base-button>
    </div>
  </ModalCommon>
</template>
<script>
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import MASTER_DATA_API from '@/api/master-data.js';
import {
  MASTER_DATA_COMMON_DEFAULT,
  MASTER_DATA_COMMON_MIN_VALUE, MAX_APPEAL_RECEIVE_LIMIT,
  MAX_PAYMENT_METHOD_LIMIT,
  MAX_SUPPORT_REQUEST_LIMIT
} from '@/config/constant';

export default {
  components: {
    ModalCommon,
    CryptoInput: () => import('@/components/common/home/crypto-input.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    masterDataCommon: {
      type: Object,
      default: () => {}
    },
    onSuccess: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      MODAL,
      MASTER_DATA_COMMON_DEFAULT,
      MASTER_DATA_COMMON_MIN_VALUE,
      MAX_PAYMENT_METHOD_LIMIT,
      MAX_SUPPORT_REQUEST_LIMIT,
      MAX_APPEAL_RECEIVE_LIMIT,
      isLoading: false,
      ...this.getInitValue(this.masterDataCommon),
      errorValidation: {
        userPaymentMethodsLimit: false,
        managerPaymentMethodsLimit: false,
        appealReceivedBySupporterLimit: false,
        appealReceivedByAdminSupporterLimit: false,
        supportRequestsReceivingLimit: false
      }
    }
  },
  computed: {
    disabledSubmit () {
      const hasError = Object.values(this.errorValidation).includes(true);
      const emptyRequiredFields = [
        this.userPaymentMethodsLimit,
        this.managerPaymentMethodsLimit,
        this.appealReceivedBySupporterLimit,
        this.appealReceivedByAdminSupporterLimit,
        this.supportRequestsReceivingLimit
      ].some(value => !value);
      return hasError || emptyRequiredFields;
    }
  },
  watch: {
    masterDataCommon (newMasterDataCommon) {
      this.setInitValue(newMasterDataCommon);
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.SETTING_OTHERS);
    },
    hideModal () {
      this.setInitValue(this.masterDataCommon);
      this.errorValidation = {
        userPaymentMethodsLimit: false,
        managerPaymentMethodsLimit: false,
        appealReceivedBySupporterLimit: false,
        appealReceivedByAdminSupporterLimit: false,
        supportRequestsReceivingLimit: false
      };
    },
    getDataNumber (value) {
      if (!value) {
        return 0;
      }
      return Number(value);
    },
    getDataString (value) {
      return value?.toString();
    },
    getInitValue (masterDataCommon) {
      return {
        userPaymentMethodsLimit: this.getDataString(masterDataCommon?.userPaymentMethodsLimit || MASTER_DATA_COMMON_DEFAULT.NUMBER_LIMIT_PAYMENT_METHOD),
        managerPaymentMethodsLimit: this.getDataString(masterDataCommon?.managerPaymentMethodsLimit || MASTER_DATA_COMMON_DEFAULT.NUMBER_LIMIT_PAYMENT_METHOD),
        appealReceivedBySupporterLimit: this.getDataString(masterDataCommon?.appealReceivedBySupporterLimit || MASTER_DATA_COMMON_DEFAULT.NUMBER_LIMIT_PICK_APPEAL),
        appealReceivedByAdminSupporterLimit: this.getDataString(masterDataCommon?.appealReceivedByAdminSupporterLimit || MASTER_DATA_COMMON_DEFAULT.NUMBER_LIMIT_PICK_APPEAL),
        supportRequestsReceivingLimit: this.getDataString(masterDataCommon?.supportRequestsReceivingLimit || MASTER_DATA_COMMON_DEFAULT.NUMBER_LIMIT_PICK_REQUEST)
      };
    },
    setInitValue (masterDataCommon) {
      const parseData = this.getInitValue(masterDataCommon);
      this.userPaymentMethodsLimit = parseData.userPaymentMethodsLimit;
      this.managerPaymentMethodsLimit = parseData.managerPaymentMethodsLimit;
      this.appealReceivedBySupporterLimit = parseData.appealReceivedBySupporterLimit;
      this.appealReceivedByAdminSupporterLimit = parseData.appealReceivedByAdminSupporterLimit;
      this.supportRequestsReceivingLimit = parseData.supportRequestsReceivingLimit;
    },
    errorMinMaxValueText (min, max) {
      return this.$t('merchant.settings.other.label.range_limit_required', {
        min,
        max
      })
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
        const payload = {
          userPaymentMethodsLimit: this.getDataNumber(this.userPaymentMethodsLimit),
          managerPaymentMethodsLimit: this.getDataNumber(this.managerPaymentMethodsLimit),
          appealReceivedBySupporterLimit: this.getDataNumber(this.appealReceivedBySupporterLimit),
          appealReceivedByAdminSupporterLimit: this.getDataNumber(this.appealReceivedByAdminSupporterLimit),
          supportRequestsReceivingLimit: this.getDataNumber(this.supportRequestsReceivingLimit)
        }
        const result = await this.$axios.$post(MASTER_DATA_API.UPDATE_SETTINGS, payload);
        if (!result.errors?.length) {
          this.$emit('on-success', payload);
        }
        this.close();
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/settings/modal-settings-limit-fee-time.scss" />
<style>
.modal-content {
  &__desc {
    color: #49526A;
  }
}
.form__title {
  color: #090B0E;
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
