<template>
  <section class="exchange-rate">
    <div class="exchange-rate__container">
      <div class="exchange-rate__header">
        <div class="exchange-rate__header-inner">
          <div class="exchange-rate__icon">
            <img src="/assets/images/common/exchange-rate/chart-money.svg" alt="icon exchange rate">
          </div>
          <div class="exchange-rate__title">{{ $t('exchange_rate.title') }}</div>
        </div>
        <div class="exchange-rate__from-binance">{{ $t('exchange_rate.from_binance') }}</div>
      </div>
      <div class="exchange-rate__inner">
        <div class="exchange-rate__form-item">
          <div class="exchange-rate__form-label">
            {{ $t('exchange_rate.lower_fiat.label') }}
          </div>
          <div class="exchange-rate__form-input">
            <CryptoInput
              ref="lowerFiatLimit"
              v-model="lowerFiatLimit"
              name="lowerFiatLimit"
              class="input-crypto"
              class-option="error--outline"
              type="tel"
              :unit="$t('home.unit-vnd')"
              :min-value="minValue"
              :max-value="maxValue"
              :placeholder="$t('exchange_rate.lower_fiat.placeholder')"
              :limit-input="15"
              :is-show-label="false"
              :error-required="$t('exchange_rate.lower_fiat.label_require')"
              :allow-decimal="false"
              :allow-leading-zeroes="false"
              @error="handleErrorValidation"
            />
          </div>
        </div>
      </div>
      <div class="exchange-rate__inner">
        <base-button
          variants="outlined"
          color="primary"
          full-width
          :disabled="disabledSubmit"
          :loading="isLoading"
          @click="onSearchExchangeRate"
        >
          {{ $t('exchange_rate.action') }}
        </base-button>
      </div>

      <div class="exchange-rate__result">
        <div class="exchange-result">
          <div class="exchange-result__head">{{ $t('exchange_rate.result') }}</div>
          <div class="exchange-result__body">
            <template v-if="isFirstInitExchangeRate">
              <div class="exchange-result__data">
                <div v-for="(item, index) in mappingExchangeRate" :key="`rate_empty_${index}`" class="exchange-result__wrapper">
                  <div class="exchange-result__text">{{ item.title }} <span v-if="item.isTooltip" :id="`exchange-result-${item.index}`" v-b-tooltip.focus tabindex="0" class="icon-info" /></div>
                  <div class="exchange-result__value" :class="{'text-blue': index === 1}">{{ item.value }}</div>
                  <b-tooltip v-if="item.isTooltip" :target="`exchange-result-${item.index}`" triggers="hover">
                    <span class="tx-note">{{ $t('exchange_rate.tooltip.price') }}</span>
                  </b-tooltip>
                </div>
                <div class="exchange-result__wrapper">
                  <div class="exchange-result__text">{{ $t('exchange_rate.percent_rate') }} <span id="exchange-result-input" v-b-tooltip.focus tabindex="0" class="icon-info" /></div>
                  <b-tooltip target="exchange-result-input" triggers="hover">
                    <span class="tx-note">{{ $t('exchange_rate.tooltip.input') }}</span>
                  </b-tooltip>
                  <div class="exchange-input-percent">
                    <CryptoInput
                      ref="percentRate"
                      v-model="percentRate"
                      name="percentRate"
                      class="input-percent"
                      class-option="error--outline"
                      type="tel"
                      :unit="$t('exchange_rate.unit.percent')"
                      :min-value="minValue"
                      error-max-value=""
                      :limit-input="8"
                      :is-show-label="false"
                      :allow-decimal="true"
                      :allow-leading-zeroes="false"
                      :decimal-limit="4"
                      @error="handleErrorValidation"
                    />
                  </div>
                </div>
                <div class="exchange-result__wrapper">
                  <div class="exchange-result__text">{{ $t('exchange_rate.recommend_price') }} <span id="exchange-result-price" v-b-tooltip.focus tabindex="0" class="icon-info" /></div>
                  <b-tooltip target="exchange-result-price" triggers="hover">
                    <span class="tx-note">{{ $t('exchange_rate.tooltip.recommend_price') }}</span>
                  </b-tooltip>
                  <div class="exchange-result__group">
                    <div class="exchange-result__value">{{ recommendedPriceFormatter }}</div>
                    <base-button
                      variants="contained"
                      color="primary"
                      :disabled="disableApply"
                      @click="applyExchangeRate"
                    >
                      {{ $t('common.apply') }}
                    </base-button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div v-if="isLoading" class="exchange-result__inner">
                <div class="exchange-result__icon">
                  <div class="exchange-result__loading" />
                </div>
                <div class="exchange-result__content">{{ $t('exchange_rate.please_waiting') }}</div>
              </div>

              <div v-else-if="hasSearchResultData" class="exchange-result__data">
                <div v-for="(item, index) in mappingExchangeRate" :key="`rate_${index}`" class="exchange-result__wrapper">
                  <div class="exchange-result__text">{{ item.title }}<span v-if="item.isTooltip" :id="`exchange-result-${item.index}`" v-b-tooltip.focus tabindex="0" class="icon-info" /></div>
                  <div class="exchange-result__value" :class="{'text-blue': index === 1}">{{ item.value }}</div>
                  <b-tooltip v-if="item.isTooltip" :target="`exchange-result-${item.index}`" triggers="hover">
                    <span class="tx-note">{{ $t('exchange_rate.tooltip.price') }}</span>
                  </b-tooltip>
                </div>
                <div class="exchange-result__wrapper">
                  <div class="exchange-result__text">{{ $t('exchange_rate.percent_rate') }} <span id="exchange-result-input" v-b-tooltip.focus tabindex="0" class="icon-info" /></div>
                  <b-tooltip target="exchange-result-input" triggers="hover">
                    <span class="tx-note">{{ $t('exchange_rate.tooltip.input') }}</span>
                  </b-tooltip>
                  <div class="exchange-input-percent">
                    <CryptoInput
                      ref="percentRate"
                      v-model="percentRate"
                      name="percentRate"
                      class="input-percent"
                      class-option="error--outline"
                      type="tel"
                      :unit="$t('exchange_rate.unit.percent')"
                      :min-value="minValue"
                      error-max-value=""
                      :limit-input="8"
                      :is-show-label="false"
                      :allow-decimal="true"
                      :decimal-limit="4"
                      :allow-leading-zeroes="false"
                      @error="handleErrorValidation"
                    />
                  </div>
                </div>
                <div class="exchange-result__wrapper">
                  <div class="exchange-result__text">{{ $t('exchange_rate.recommend_price') }} <span id="exchange-result-price" v-b-tooltip.focus tabindex="0" class="icon-info" /></div>
                  <b-tooltip target="exchange-result-price" triggers="hover">
                    <span class="tx-note">{{ $t('exchange_rate.tooltip.recommend_price') }}</span>
                  </b-tooltip>
                  <div class="exchange-result__group">
                    <div class="exchange-result__value">{{ recommendedPriceFormatter }}</div>
                    <base-button
                      variants="contained"
                      color="primary"
                      :disabled="disableApply"
                      @click="applyExchangeRate"
                    >
                      {{ $t('common.apply') }}
                    </base-button>
                  </div>
                </div>
              </div>

              <div v-else class="exchange-result__inner">
                <div class="exchange-result__no-data">
                  <img src="/assets/images/common/exchange-rate/no-data.svg" alt="icon no data">
                </div>
                <div class="exchange-result__content">{{ $t('exchange_rate.no_data') }}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { CRYPTO_INPUT_MAX_VALUE } from '@/config/constant';
import POST_API from '@/api/post';
import isEmpty from 'lodash/isEmpty';

export default {
  components: {
    CryptoInput: () => import('@/components/common/home/crypto-input.vue'),
    BaseButton: () => import('~/components/common/base-button/index.vue')
  },
  props: {
    assetName: {
      type: String,
      default: ''
    },
    fiatSymbol: {
      type: String,
      default: ''
    },
    decimalLimit: {
      type: Number,
      default: 0
    },
    postType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isFirstInitExchangeRate: true,
      referenceExchangeRateInfo: null,
      minValue: 1,
      maxPercent: 999.9999,
      minPercent: 1,
      maxValue: CRYPTO_INPUT_MAX_VALUE,
      lowerFiatLimit: null,
      percentRate: '100',
      errorValidation: {
        lowerFiatLimit: false
      },
      isLoading: false
    }
  },
  computed: {
    disabledSubmit () {
      const hasError = Object.values(this.errorValidation).includes(true);
      const emptyRequiredFields = [
        this.lowerFiatLimit,
        this.assetName
      ].some(value => !value);
      return hasError || emptyRequiredFields;
    },
    lowerFiatLimitNumber () {
      return this.$options.filters.formatMarkToNumber(this.lowerFiatLimit)
    },
    errorMinMaxValueText () {
      return this.$t('exchange_rate.range_limit_required', {
        min: this.minValue,
        max: this.$options.filters.formatMoney(this.maxValue)
      })
    },
    hasSearchResultData () {
      return !isEmpty(this.referenceExchangeRateInfo)
    },
    priceFormatter () {
      if (!this.referenceExchangeRateInfo) {
        return '--'
      }
      return `${this.fiatSymbol}${this.$options.filters.formatCrypto(this.referenceExchangeRateInfo?.price, this.decimalLimit, 'ceil')}`
    },
    availableAmountFormatter () {
      if (!this.referenceExchangeRateInfo) {
        return '--'
      }
      return `${this.$options.filters.formatCrypto(this.referenceExchangeRateInfo?.availableAmount)} ${this.assetName}`
    },
    limitFiatFormatter () {
      if (!this.referenceExchangeRateInfo) {
        return '--'
      }
      const lowerFiatLimit = this.$options.filters.formatMoney(this.referenceExchangeRateInfo?.lowerFiatLimit)
      return `${this.fiatSymbol}${lowerFiatLimit}`
    },
    recommendedPriceFormatter () {
      if (!Number(this.percentRate) || !this.referenceExchangeRateInfo?.price) {
        return '--'
      }
      const recommendedPrice = this.referenceExchangeRateInfo?.price * (Number(this.percentRate) / 100)
      const recommendedPriceFormat = this.$options.filters.formatMoney(recommendedPrice)
      return `${this.fiatSymbol} ${recommendedPriceFormat}`
    },
    mappingExchangeRate () {
      return [
        {
          title: this.$t('exchange_rate.available'),
          value: this.availableAmountFormatter
        },
        {
          title: this.$t('exchange_rate.limit'),
          value: this.limitFiatFormatter
        },
        {
          title: this.$t('exchange_rate.price'),
          value: this.priceFormatter,
          isTooltip: true
        }
      ]
    },
    disableApply () {
      return !Number(this.percentRate) || !this.referenceExchangeRateInfo || !this.assetName
    }
  },
  watch: {
    assetName () {
      this.isFirstInitExchangeRate = true
      this.referenceExchangeRateInfo = null
    },
    percentRate (value) {
      const isMoreThanMax = this.$options.filters.formatMarkToNumber(value) > this.maxPercent
      if (isMoreThanMax) {
        this.percentRate = this.maxPercent
      }
      this.$emit('on-change-percent', isMoreThanMax ? this.$options.filters.formatMoney(this.maxPercent) : value)
    }
  },
  methods: {
    handleErrorValidation (errorValidation) {
      if (!errorValidation?.name) {
        return;
      }

      this.errorValidation = {
        ...this.errorValidation,
        [errorValidation.name]: errorValidation.error
      };
    },
    async onSearchExchangeRate () {
      try {
        this.isFirstInitExchangeRate = false
        this.isLoading = true
        const { data } = await this.$axios.$get(POST_API.SEARCH_REFERENCE_EXCHANGE_RATE, {
          params: {
            assetName: this.assetName,
            postType: this.postType,
            lowerFiatLimit: this.lowerFiatLimitNumber
          }
        })
        this.referenceExchangeRateInfo = data?.referenceExchangeRateInfo || null
        if (this.referenceExchangeRateInfo?.price) {
          this.$emit('get-exchange-rate', this.referenceExchangeRateInfo?.price)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    applyExchangeRate () {
      const updatePrice = this.referenceExchangeRateInfo?.price * (Number(this.percentRate) / 100)
      this.$emit('apply-exchange-rate', updatePrice)
    }
  }
}
</script>
<style scoped lang="scss" src="static/assets/scss/components/common/forms/exchange-rate/index.scss">
</style>
