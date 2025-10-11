<template>
  <ModalCommon
    :id="MODAL.SETTING_LIMIT_FEE_TIME"
    :ref="MODAL.SETTING_LIMIT_FEE_TIME"
    :title="$t('merchant.settings.limit_fee_time.title')"
    modal-class="modal-mobile-bottom"
    @hide-modal="hideModal"
  >
    <div class="modal-content pt-md-3 grey-900 font-t14r">
      <p class="grey-400 mt-3 pb-1">{{ $t('merchant.settings.limit_fee_time.description') }}</p>

      <div class="form">
        <div class="form__item">
          <div class="form__label">
            {{ $t('merchant.settings.limit_fee_time.label.order_limit') }}
            <span id="order-limit" v-b-tooltip.focus tabindex="0" class="icon-info" />
            <b-tooltip target="order-limit" :triggers="tooltipTrigger" :custom-class="classTooltip">
              <span class="text-note">{{ $t('merchant.settings.limit_fee_time.tooltip.order_limit') }}</span>
            </b-tooltip>
          </div>
          <div class="form__amount-limit d-flex justify-content-between">
            <div class="position-relative">
              <CryptoInput
                ref="minOrderLimit"
                v-model="minOrderLimit"
                name="minOrderLimit"
                class="input-crypto--small"
                class-option="error--outline"
                type="tel"
                unit="VND"
                :min-value="MASTER_DATA_COMMON_MIN_VALUE.MIN_ORDER_LIMIT"
                :max-value="maxOrderLimitFormatter"
                :limit-input="15"
                :is-show-label="false"
                :label="$t('merchant.settings.limit_fee_time.label.order_limit')"
                :label-require="$t('merchant.settings.limit_fee_time.label.order_limit')"
                :allow-decimal="false"
                :allow-leading-zeroes="false"
                @error="handleErrorValidation"
              />
            </div>
            <div class="position-relative">
              <CryptoInput
                ref="maxOrderLimit"
                v-model="maxOrderLimit"
                name="maxOrderLimit"
                class="input-crypto--small"
                class-option="error--outline"
                type="tel"
                unit="VND"
                :min-value="minOrderLimitFormatter > 0 ? minOrderLimitFormatter : MASTER_DATA_COMMON_MIN_VALUE.MAX_ORDER_LIMIT"
                :max-value="null"
                :limit-input="15"
                :is-show-label="false"
                :label="$t('merchant.settings.limit_fee_time.label.order_limit')"
                :label-require="$t('merchant.settings.limit_fee_time.label.order_limit')"
                :allow-decimal="false"
                :decimal-limit="2"
                :allow-leading-zeroes="false"
                @error="handleErrorValidation"
              />
            </div>
          </div>
        </div>

        <div class="form__item">
          <div class="form__label">
            {{ $t('merchant.settings.limit_fee_time.label.post_limit') }}
            <span id="post-limit" v-b-tooltip.focus tabindex="0" class="icon-info" />
            <b-tooltip target="post-limit" :triggers="tooltipTrigger" :custom-class="classTooltip">
              <span class="text-note">{{ $t('merchant.settings.limit_fee_time.tooltip.post_limit') }}</span>
            </b-tooltip>
          </div>
          <div class="form__amount-limit d-flex justify-content-between">
            <div class="position-relative">
              <CryptoInput
                ref="minPostLimit"
                v-model="minPostLimit"
                name="minPostLimit"
                class="input-crypto--small"
                class-option="error--outline"
                type="tel"
                unit="VND"
                :min-value="MASTER_DATA_COMMON_MIN_VALUE.MIN_POST_LIMIT"
                :max-value="maxPostLimitFormatter"
                :limit-input="15"
                :is-show-label="false"
                :label="$t('merchant.settings.limit_fee_time.label.post_limit')"
                :label-require="$t('merchant.settings.limit_fee_time.label.post_limit')"
                :allow-decimal="false"
                :allow-leading-zeroes="false"
                @error="handleErrorValidation"
              />
            </div>
            <div class="position-relative">
              <CryptoInput
                ref="maxPostLimit"
                v-model="maxPostLimit"
                name="maxPostLimit"
                class="input-crypto--small"
                class-option="error--outline"
                type="tel"
                unit="VND"
                :min-value="minPostLimitFormatter > 0 ? minPostLimitFormatter : MASTER_DATA_COMMON_MIN_VALUE.MAX_POST_LIMIT"
                :max-value="null"
                :limit-input="15"
                :is-show-label="false"
                :label="$t('merchant.settings.limit_fee_time.label.post_limit')"
                :label-require="$t('merchant.settings.limit_fee_time.label.post_limit')"
                :allow-decimal="false"
                :decimal-limit="2"
                :allow-leading-zeroes="false"
                @error="handleErrorValidation"
              />
            </div>
          </div>
        </div>

        <div class="form__item">
          <div class="d-flex justify-content-between">
            <div class="position-relative">
              <div class="form__label">
                {{ $t('merchant.settings.limit_fee_time.label.fee') }}
                <span id="fee" v-b-tooltip.focus tabindex="0" class="icon-info" />
                <b-tooltip target="fee" :triggers="tooltipTrigger" :custom-class="classTooltip">
                  <span class="text-note">{{ $t('merchant.settings.limit_fee_time.tooltip.fee') }}</span>
                </b-tooltip>
              </div>
              <div class="position-relative">
                <CryptoInput
                  ref="fee"
                  v-model="fee"
                  name="fee"
                  class="input-crypto"
                  class-option="error--outline"
                  type="tel"
                  unit="%"
                  :min-value="MASTER_DATA_COMMON_MIN_VALUE.FEE"
                  :max-value="100"
                  :limit-input="4"
                  :is-show-label="false"
                  :label="$t('merchant.settings.limit_fee_time.label.fee')"
                  :label-require="$t('merchant.settings.limit_fee_time.label.fee')"
                  :error-min-value="getErrorMinValueFee(
                    $t('merchant.settings.limit_fee_time.label.fee'),
                    MASTER_DATA_COMMON_MIN_VALUE.FEE
                  )"
                  :allow-decimal="true"
                  :decimal-limit="2"
                  :allow-leading-zeroes="false"
                  @error="handleErrorValidation"
                />
              </div>
            </div>
            <div class="position-relative">
              <div class="form__label">
                {{ $t('merchant.settings.limit_fee_time.label.penalty_fee') }}
                <span id="penalty-fee" v-b-tooltip.focus tabindex="0" class="icon-info" />
                <b-tooltip target="penalty-fee" :triggers="tooltipTrigger" :custom-class="classTooltip">
                  <span class="text-note">{{ $t('merchant.settings.limit_fee_time.tooltip.penalty_fee') }}</span>
                </b-tooltip>
              </div>
              <div class="position-relative">
                <CryptoInput
                  ref="penaltyFee"
                  v-model="penaltyFee"
                  name="penaltyFee"
                  class="input-crypto"
                  class-option="error--outline"
                  type="tel"
                  unit="%"
                  :min-value="MASTER_DATA_COMMON_MIN_VALUE.PENALTY_FEE"
                  :max-value="100"
                  :limit-input="4"
                  :is-show-label="false"
                  :label="$t('merchant.settings.limit_fee_time.label.penalty_fee')"
                  :label-require="$t('merchant.settings.limit_fee_time.label.penalty_fee')"
                  :error-min-value="getErrorMinValueFee(
                    $t('merchant.settings.limit_fee_time.label.penalty_fee'),
                    MASTER_DATA_COMMON_MIN_VALUE.PENALTY_FEE
                  )"
                  :allow-decimal="true"
                  :decimal-limit="2"
                  :allow-leading-zeroes="false"
                  @error="handleErrorValidation"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="form__item">
          <div class="form__label">
            {{ $t('merchant.settings.limit_fee_time.label.user_ask_merchant_time') }}
            <span id="user-ask-merchant-time" v-b-tooltip.focus tabindex="0" class="icon-info" />
            <b-tooltip target="user-ask-merchant-time" :triggers="tooltipTrigger" :custom-class="classTooltip">
              <span class="text-note">
                {{ $t('merchant.settings.limit_fee_time.tooltip.user_ask_merchant_time') }}
              </span>
            </b-tooltip>
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="userAskMerchantTime"
              v-model="userAskMerchantTime"
              name="userAskMerchantTime"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :unit="$t('datetime_unit.minute')"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.USER_ASK_MERCHANT_TIME"
              :max-value="MASTER_DATA_COMMON_MAX_VALUE.MAX_ASK_TIME"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.USER_ASK_MERCHANT_TIME, MASTER_DATA_COMMON_MAX_VALUE.MAX_ASK_TIME)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.USER_ASK_MERCHANT_TIME, MASTER_DATA_COMMON_MAX_VALUE.MAX_ASK_TIME)"
              :limit-input="2"
              :is-show-label="false"
              :label="$t('merchant.settings.limit_fee_time.label.user_ask_merchant_time')"
              :label-require="$t('merchant.settings.limit_fee_time.label.user_ask_merchant_time')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>

        <div class="form__item">
          <div class="form__label">
            {{ $t('merchant.settings.limit_fee_time.label.user_ask_cs_time') }}
            <span id="user-ask-cs-time" v-b-tooltip.focus tabindex="0" class="icon-info" />
            <b-tooltip target="user-ask-cs-time" :triggers="tooltipTrigger" :custom-class="classTooltip">
              <span class="text-note">
                {{ $t('merchant.settings.limit_fee_time.tooltip.user_ask_cs_time') }}
              </span>
            </b-tooltip>
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="userAskCSTime"
              v-model="userAskCSTime"
              name="userAskCSTime"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :unit="$t('datetime_unit.minute')"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.USER_ASK_CS_TIME"
              :max-value="MASTER_DATA_COMMON_MAX_VALUE.MAX_ASK_TIME"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.USER_ASK_CS_TIME, MASTER_DATA_COMMON_MAX_VALUE.MAX_ASK_TIME)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.USER_ASK_CS_TIME, MASTER_DATA_COMMON_MAX_VALUE.MAX_ASK_TIME)"
              :limit-input="2"
              :is-show-label="false"
              :label="$t('merchant.settings.limit_fee_time.label.user_ask_cs_time')"
              :label-require="$t('merchant.settings.limit_fee_time.label.user_ask_cs_time')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>

        <div class="form__item">
          <div class="form__label">
            {{ $t('merchant.settings.limit_fee_time.label.submit_evidence_time') }}
            <span id="submit-evidence-time" v-b-tooltip.focus tabindex="0" class="icon-info" />
            <b-tooltip target="submit-evidence-time" :triggers="tooltipTrigger" :custom-class="classTooltip">
              <span class="text-note">
                {{ $t('merchant.settings.limit_fee_time.tooltip.submit_evidence_time') }}
              </span>
            </b-tooltip>
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="evidenceProvisionTimeLimit"
              v-model="evidenceProvisionTimeLimit"
              name="evidenceProvisionTimeLimit"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :unit="$t('datetime_unit.minute')"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.SUBMIT_EVIDENCE_TIME"
              :max-value="MASTER_DATA_COMMON_MAX_VALUE.SUBMIT_EVIDENCE_TIME"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SUBMIT_EVIDENCE_TIME, MASTER_DATA_COMMON_MAX_VALUE.SUBMIT_EVIDENCE_TIME)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.SUBMIT_EVIDENCE_TIME, MASTER_DATA_COMMON_MAX_VALUE.SUBMIT_EVIDENCE_TIME)"
              :limit-input="15"
              :is-show-label="false"
              :label="$t('merchant.settings.limit_fee_time.label.submit_evidence_time')"
              :error-required="$t('merchant.settings.limit_fee_time.label.submit_evidence_time_required')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>

        <div class="form__item">
          <div class="form__label">
            {{ $t('merchant.settings.limit_fee_time.label.crypto_transaction_time') }}
            <span id="crypto-transaction-time" v-b-tooltip.focus tabindex="0" class="icon-info" />
            <b-tooltip target="crypto-transaction-time" :triggers="tooltipTrigger" :custom-class="classTooltip">
              <span class="text-note">
                {{ $t('merchant.settings.limit_fee_time.tooltip.crypto_transaction_time') }}
              </span>
            </b-tooltip>
          </div>
          <div class="position-relative">
            <CryptoInput
              ref="cryptoTransactionTime"
              v-model="cryptoSendingWaitTimeLimit"
              name="cryptoTransactionTime"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :unit="$t('datetime_unit.minute')"
              :min-value="MASTER_DATA_COMMON_MIN_VALUE.CRYPTO_TRANSACTION_TIME"
              :max-value="MASTER_DATA_COMMON_MAX_VALUE.CRYPTO_TRANSACTION_TIME"
              :error-min-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.CRYPTO_TRANSACTION_TIME, MASTER_DATA_COMMON_MAX_VALUE.CRYPTO_TRANSACTION_TIME)"
              :error-max-value="errorMinMaxValueText(MASTER_DATA_COMMON_MIN_VALUE.CRYPTO_TRANSACTION_TIME, MASTER_DATA_COMMON_MAX_VALUE.CRYPTO_TRANSACTION_TIME)"
              :limit-input="15"
              :is-show-label="false"
              :label="$t('merchant.settings.limit_fee_time.label.crypto_transaction_time')"
              :error-required="$t('merchant.settings.limit_fee_time.label.crypto_transaction_time_required')"
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
import BigNumber from 'bignumber.js'
import ModalCommon from '@/components/desktop/modal/modal-common.vue';
import { MODAL } from '@/resources/modal.js';
import MASTER_DATA_API from '@/api/master-data.js';
import {
  MASTER_DATA_COMMON_DEFAULT,
  MASTER_DATA_COMMON_MAX_VALUE,
  MASTER_DATA_COMMON_MIN_VALUE
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
      MASTER_DATA_COMMON_MAX_VALUE,
      isLoading: false,
      ...this.getInitValue(this.masterDataCommon),
      errorValidation: {
        minOrderLimit: false,
        maxOrderLimit: false,
        minPostLimit: false,
        maxPostLimit: false,
        fee: false,
        penaltyFee: false,
        userAskMerchantTime: false,
        userAskCSTime: false,
        evidenceProvisionTimeLimit: false,
        cryptoSendingWaitTimeLimit: false
      }
    }
  },
  computed: {
    classTooltip () {
      return this.$device.isDesktop ? '' : 'tooltip-mb';
    },
    tooltipTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover';
    },
    disabledSubmit () {
      const hasError = Object.values(this.errorValidation).includes(true);
      const emptyRequiredFields = [
        this.minOrderLimit,
        this.maxOrderLimit,
        this.minPostLimit,
        this.maxPostLimit,
        this.fee,
        this.penaltyFee,
        this.userAskMerchantTime,
        this.userAskCSTime,
        this.evidenceProvisionTimeLimit,
        this.cryptoSendingWaitTimeLimit
      ].some(value => !value);
      return hasError || emptyRequiredFields;
    },
    maxOrderLimitFormatter () {
      return this.$options.filters.formatMarkToNumber(this.maxOrderLimit)
    },
    minOrderLimitFormatter () {
      return this.$options.filters.formatMarkToNumber(this.minOrderLimit)
    },
    maxPostLimitFormatter () {
      return this.$options.filters.formatMarkToNumber(this.maxPostLimit)
    },
    minPostLimitFormatter () {
      return this.$options.filters.formatMarkToNumber(this.minPostLimit)
    }
  },
  watch: {
    masterDataCommon (newMasterDataCommon) {
      this.setInitValue(newMasterDataCommon);
    }
  },
  methods: {
    close () {
      this.$bvModal.hide(MODAL.SETTING_LIMIT_FEE_TIME);
    },
    hideModal () {
      this.setInitValue(this.masterDataCommon);
      this.errorValidation = {
        minOrderLimit: false,
        maxOrderLimit: false,
        minPostLimit: false,
        maxPostLimit: false,
        fee: false,
        penaltyFee: false,
        userAskMerchantTime: false,
        userAskCSTime: false,
        evidenceProvisionTimeLimit: false,
        cryptoSendingWaitTimeLimit: false
      };
    },
    getMoney (value) {
      if (!value) {
        return '';
      }
      return this.$options.filters.formatMoney(value);
    },
    getMoneyNumber (value) {
      if (!value) {
        return 0;
      }
      return this.$options.filters.formatMarkToNumber(value.toString());
    },
    getPercentInput (value) {
      if (!value) {
        return '';
      }
      return new BigNumber(Number(value || 0)).multipliedBy(100).toString();
    },
    getPercentNumber (value) {
      return Number(value || 0) / 100;
    },
    getTime (value) {
      return value?.toString();
    },
    getTimeNumber (value) {
      if (!value) {
        return 0;
      }
      return Number(value);
    },
    getErrorMinValueFee (label, minValue) {
      return `${label} tối thiểu là ${minValue}%`;
    },
    errorMinMaxValueText (min, max) {
      return this.$t('merchant.settings.other.label.range_limit_required', {
        min,
        max
      })
    },
    getInitValue (masterDataCommon) {
      return {
        minOrderLimit: this.getMoney(masterDataCommon?.minOrderLimit || MASTER_DATA_COMMON_DEFAULT.MIN_ORDER_LIMIT),
        maxOrderLimit: this.getMoney(masterDataCommon?.maxOrderLimit || MASTER_DATA_COMMON_DEFAULT.MAX_ORDER_LIMIT),
        minPostLimit: this.getMoney(masterDataCommon?.minPostLimit || MASTER_DATA_COMMON_DEFAULT.MIN_POST_LIMIT),
        maxPostLimit: this.getMoney(masterDataCommon?.maxPostLimit || MASTER_DATA_COMMON_DEFAULT.MAX_POST_LIMIT),
        fee: this.getPercentInput(masterDataCommon?.fee || MASTER_DATA_COMMON_DEFAULT.FEE),
        penaltyFee: this.getPercentInput(masterDataCommon?.penaltyFee || MASTER_DATA_COMMON_DEFAULT.PENALTY_FEE),
        userAskMerchantTime: this.getTime(
          masterDataCommon?.userAskMerchantTime || MASTER_DATA_COMMON_DEFAULT.USER_ASK_MERCHANT_TIME
        ),
        userAskCSTime: this.getTime(masterDataCommon?.userAskCSTime || MASTER_DATA_COMMON_DEFAULT.USER_ASK_CS_TIME),
        evidenceProvisionTimeLimit: this.$options.filters.formatMoney(masterDataCommon?.evidenceProvisionTimeLimit || MASTER_DATA_COMMON_DEFAULT.SUBMIT_EVIDENCE_TIME),
        cryptoSendingWaitTimeLimit: this.getTime(masterDataCommon?.cryptoSendingWaitTimeLimit || MASTER_DATA_COMMON_DEFAULT.CRYPTO_TRANSACTION_TIME)
      };
    },
    setInitValue (masterDataCommon) {
      const parseData = this.getInitValue(masterDataCommon);
      this.minOrderLimit = parseData.minOrderLimit;
      this.maxOrderLimit = parseData.maxOrderLimit;
      this.minPostLimit = parseData.minPostLimit;
      this.maxPostLimit = parseData.maxPostLimit;
      this.fee = parseData.fee;
      this.penaltyFee = parseData.penaltyFee;
      this.userAskMerchantTime = parseData.userAskMerchantTime;
      this.userAskCSTime = parseData.userAskCSTime;
      this.evidenceProvisionTimeLimit = parseData.evidenceProvisionTimeLimit;
      this.cryptoSendingWaitTimeLimit = parseData.cryptoSendingWaitTimeLimit;
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
          minOrderLimit: this.getMoneyNumber(this.minOrderLimit),
          maxOrderLimit: this.getMoneyNumber(this.maxOrderLimit),
          minPostLimit: this.getMoneyNumber(this.minPostLimit),
          maxPostLimit: this.getMoneyNumber(this.maxPostLimit),
          fee: this.getPercentNumber(this.fee),
          penaltyFee: this.getPercentNumber(this.penaltyFee),
          userAskMerchantTime: this.getTimeNumber(this.userAskMerchantTime),
          userAskCSTime: this.getTimeNumber(this.userAskCSTime),
          evidenceProvisionTimeLimit: this.$options.filters.formatMarkToNumber(this.evidenceProvisionTimeLimit),
          cryptoSendingWaitTimeLimit: this.getTimeNumber(this.cryptoSendingWaitTimeLimit)
        }
        // Request to update
        const result = await this.$axios.$post(MASTER_DATA_API.UPDATE_SETTINGS, payload);
        // The case the result is successful
        if (!result.errors?.length) {
          this.$emit('on-success', payload);
        }
        // Close the popup
        this.close();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/settings/modal-settings-limit-fee-time.scss" />
