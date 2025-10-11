<template>
  <div class="form-ad">
    <div class="form-ad__container">
      <div class="form-ad__header">
        <div class="selector">
          <div class="form-ad__selector-asset w-100">
            <div class="form-ad__label">{{ $t('form_post.label.type_asset') }}</div>
            <b-dropdown :disabled="isEdit || isUnSupportedWallet" class="ad-asset" toggle-class="ad-asset__toggle">
              <template v-if="isUnSupportedWallet" #button-content>
                {{ $t('form_post.unsupported_wallet') }}
                <span class="icon-triangle-down" />
              </template>
              <template v-else-if="isEdit" #button-content>
                {{ assetCryptoName }}
                <span class="icon-triangle-down" />
              </template>
              <template v-else #button-content>
                {{ assetName }} ({{ assetNetwork }})
                <span class="icon-triangle-down" />
              </template>
              <div class="dropdown-cnt">
                <b-dropdown-item
                  v-for="(item, index) in assetsFormatter"
                  :key="index"
                  :class="{ active: asset === item.id, disabled: isEdit}"
                  @click="changeAsset(item)"
                >
                  {{ item.name }} ({{ item.network }})
                </b-dropdown-item>
              </div>
            </b-dropdown>
          </div>
        </div>
        <div class="selector">
          <div class="selector__label">{{ $t('form_post.label.type_fiat') }}</div>
          <div class="selector__radio-group">
            <div
              v-for="item in fiats"
              :key="item.id"
              :class="{ active: fiat === item.id, disabled: isEdit }"
              class="radio-button"
              @click="changeFiat(item)"
            >
              <span class="radio-button__icon" />
              <div class="radio-button__name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-ad__body">
        <div class="form-ad__total d-flex">
          <div class="form-ad__amount-info">
            <div class="d-flex w-100 mb-2 pb-1">
              <div class="d-flex flex-column w-100">
                <div class="form-ad__label">
                  {{ $t('form_post.label.price_before') }} <span :id="`your-price-${adType}`" v-b-tooltip.focus tabindex="0" class="icon-info" />
                  <b-tooltip :target="`your-price-${adType}`" :triggers="tooltipTrigger" :custom-class="classTooltipPrice">
                    <span class="tx-note">{{ $t('form_post.tooltip.your_price_desc', { type: adType === 'BUY' ? $t('home.sell').toLowerCase() : $t('home.buy').toLowerCase()}) }}</span>
                    <span class="tx-note">{{ $t('form_post.tooltip.your_price_formula') }}</span>
                  </b-tooltip>
                </div>
                <div :class="`price-value ${adType.toLowerCase()}`">
                  <span>{{ fiatSymbol }}</span>
                  <template v-if="isBuyPostType">
                    {{ priceAfter | formatCrypto(decimalLimit, 'floor') }}
                  </template>
                  <template v-else>
                    {{ priceAfter | formatCrypto(decimalLimit, 'ceil') }}
                  </template>
                </div>
              </div>
              <div class="d-flex flex-column w-100">
                <div class="form-ad__label">
                  {{ priceMarket }} <span :id="`min-price-${adType}`" v-b-tooltip.focus tabindex="0" class="icon-info" />
                  <b-tooltip :target="`min-price-${adType}`" :triggers="tooltipTrigger">
                    <span class="tx-note">{{ tooltipPriceMarket }}</span>
                  </b-tooltip>
                </div>
                <div class="price-value"><span>{{ fiatSymbol }}</span> {{ quotedMinPrice | formatCrypto(decimalLimit, 'round') }}</div>
              </div>
            </div>
            <div class="desired-price mb-2">
              <span class="icon-square-minus" @click="updatePrice('minius')" />
              <span class="icon-plus" @click="updatePrice('plus')" />
              <CryptoInput
                ref="price"
                v-model="price"
                class="desired-price__input"
                class-option="error--outline"
                placeholder="0.000000"
                type="tel"
                :min-value="0"
                :max-value="null"
                :limit-input="15"
                :label="$t('form_post.label.price_after')"
                :label-require="$t('form_post.label.amount_require')"
                :allow-decimal="true"
                :decimal-limit="decimalLimit"
                :allow-leading-zeroes="false"
                @blur="formatPrice('price', decimalLimit)"
                @error="onError"
              />
            </div>
            <div class="position-relative  mb-4 mt-2">
              <CryptoInput
                ref="amountAsset"
                v-model="amountAsset"
                name="minPostLimitFormAd"
                class="input-crypto input-min-post-limit"
                class-option="error--outline"
                :placeholder="placeholderAmountAsset"
                type="tel"
                :unit="assetUnit"
                :price-after="priceAfter"
                :min-value="minPostLimit"
                :max-value="maxPostLimit"
                :limit-input="15"
                :label="availableAmountTitle"
                :label-require="validateTitle"
                :allow-decimal="true"
                :decimal-limit="2"
                :allow-leading-zeroes="false"
                @blur="formatPrice('amountAsset', 2)"
                @error="onError"
              />
              <p class="available-amount">({{ $t('home.balance') }}: {{ balance | formatCrypto }} {{ assetUnit }})</p>
              <div v-if="amountAsset" class="actually-received">({{ availableFiatTitle }} ~{{ fiatSymbol }} {{ actuallyAmount | formatMoney(1) }})</div>
            </div>
            <div class="form-ad__amount-limit  d-flex justify-content-between">
              <div class="position-relative">
                <CryptoInput
                  ref="minFiat"
                  v-model="minFiat"
                  class="input-crypto--small"
                  class-option="error--outline"
                  :placeholder="placeholderMinFiat"
                  type="tel"
                  unit="VND"
                  :label="$t('form_post.label.min_fiat')"
                  :min-value="minOrderLimit"
                  :max-value="maxOrderLimit"
                  :error-max-value="errorMaxValueText"
                  :error-min-value="errorMinValueText"
                  :label-require="$t('form_post.title.min_fiat')"
                  :allow-decimal="false"
                  :allow-leading-zeroes="false"
                  :max-fiat="maxFiat"
                  :min-available-amount="actuallyAmount"
                  :error-min-available-amount="errorMinAvailableAmount"
                  @error="onMinFiatError"
                />
                <div v-if="minFiat && !minFiatError" class="actually-received">(~{{ actuallyMin | formatCrypto(2, 'round') }} {{ assetUnit }})</div>
              </div>
              <div class="position-relative">
                <CryptoInput
                  ref="maxFiat"
                  v-model="maxFiat"
                  class="input-crypto--small"
                  class-option="error--outline"
                  :placeholder="placeholderMaxFiat"
                  type="tel"
                  unit="VND"
                  :min-value="minOrderLimit"
                  :max-value="maxOrderLimit"
                  :error-max-value="errorMaxValueText"
                  :error-min-value="errorMinInputMaxFiatText"
                  :label="$t('form_post.label.max_fiat')"
                  :label-require="$t('form_post.title.max_fiat')"
                  :allow-decimal="false"
                  :allow-leading-zeroes="false"
                  :min-fiat="minFiat"
                  :max-available-amount="actuallyAmount"
                  :error-max-available-amount="errorMaxAvailableAmount"
                  @error="onMaxFiatError"
                />
                <div v-if="maxFiat && !maxFiatError" class="actually-received">(~{{ actuallyMax | formatCrypto(2, 'round') }} {{ assetUnit }})</div>
              </div>
            </div>
          </div>
          <div class="form-ad__payment-info">
            <div v-show="adType === ORDER_TYPE.SELL" class="w-100">
              <div class="form-ad__label payment-label">
                {{ $t("form_post.label.payment_method") }}
              </div>
              <div v-if="payments.length === 0" class="no-payment">{{ $t('add_bank_modal.no_payment') }}</div>
              <bank-list-payment-method-selector
                v-else
                :filter-banks="payments"
                :placeholder="$t('form_post.payment.title')"
              />
            </div>
            <div v-show="isHasSelectedPayment" class="w-100 bank-info">
              <div class="bank-info__item">
                <span class="bank-info__label">{{ $t('form_post.payment.bank_name') }}</span>
                <span class="bank-info__value">{{ getBankName }}</span>
              </div>
              <div class="bank-info__item">
                <span class="bank-info__label">{{ $t('form_post.payment.bank_number') }}</span>
                <span class="bank-info__value">{{ selectedPayment?.bankNumber }}</span>
              </div>
              <div class="bank-info__item">
                <span class="bank-info__label">{{ $t('form_post.payment.bank_holder') }}</span>
                <span class="bank-info__value">{{ selectedPayment?.bankHolder }}</span>
              </div>
              <div class="bank-info__item">
                <span class="bank-info__label">{{ $t('form_post.payment.bank_branch') }}</span>
                <span class="bank-info__value">{{ selectedPayment?.bankRemark }}</span>
              </div>
            </div>
            <div class="w-100">
              <div class="form-ad__label">{{ $t('form_post.label.transaction_time') }}</div>
              <b-dropdown class="ad-asset" toggle-class="ad-asset__toggle">
                <template #button-content>
                  {{ time }} {{ $t('form_post.label.minute') }}
                  <span class="icon-triangle-down" />
                </template>
                <div class="dropdown-cnt">
                  <b-dropdown-item
                    v-for="(item, index) in transactionTimes"
                    :key="index"
                    :class="{ 'ad-asset--active':time === item }"
                    @click="time=item"
                  >
                    {{ item }} {{ $t('form_post.label.minute') }}
                  </b-dropdown-item>
                </div>
              </b-dropdown>
            </div>
            <div class="payment-info__fee">
              <div class="d-flex flex-column w-50">
                <div class="form-ad__label">
                  {{ $t('form_post.label.transaction_fee') }}<span :id="`transaction-fee-${adType}`" v-b-tooltip.focus tabindex="0" class="icon-info" />
                  <b-tooltip :target="`transaction-fee-${adType}`" :triggers="tooltipTrigger">
                    <span class="tx-note">{{ $t('form_post.tooltip.transaction_fee') }}</span>
                  </b-tooltip>
                </div>
                <div class="fee-percent">{{ transactionFeePercent }}%</div>
                <div v-if="amountAsset" class="fee-value">(~{{ fiatSymbol }} {{ transactionFee | formatMoney(1) }})</div>
              </div>
              <div class="d-flex flex-column w-50">
                <div class="form-ad__label">
                  {{ $t('form_post.label.punish_fee') }}<span :id="`punish-fee-${adType}`" v-b-tooltip.focus tabindex="0" class="icon-info" />
                  <b-tooltip :target="`punish-fee-${adType}`" :triggers="tooltipTrigger">
                    <span class="tx-note">{{ $t('form_post.tooltip.punish_fee') }}</span>
                  </b-tooltip>
                </div>
                <div class="fee-percent">{{ punishFeePercent }}%</div>
                <div v-if="amountAsset" class="fee-value">(~{{ fiatSymbol }} {{ punishFee | formatMoney(1) }})</div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-ad__note">
          <div class="form-ad__label">{{ $t('form_post.label.note') }}</div>
          <b-form-textarea
            id="textarea-rows"
            v-model="note"
            :formatter="formatterNote"
            class="form-ad__textarea"
            :placeholder="$t('form_post.placeholder.note')"
            rows="8"
          />
          <span class="form-ad__note-count">{{ note?.trim()?.length }} / 300</span>
        </div>
        <div class="selector">
          <div class="selector__label">{{ $t('form_post.label.status') }}</div>
          <div class="selector__radio-group">
            <div
              v-for="item in LIST_STATUS"
              :key="item.id"
              :class="{ active: showAd === item.id }"
              class="radio-button"
              @click="showAd = item.id"
            >
              <span class="radio-button__icon" />
              <div class="radio-button__name">{{ $t('form_post.status.'+ item.name) }}</div>
            </div>
          </div>
        </div>
        <div class="form-ad__footer">
          <base-button
            variants="contained"
            color="primary"
            width="240px"
            :disabled="disabledSubmit"
            @click="submit"
          >
            {{ buttonName }}
          </base-button>
          <base-button
            class="btn-cancel"
            variants="text"
            @click="cancel"
          >
            {{ $t('form_post.button.cancel') }}
          </base-button>
        </div>
      </div>
    </div>

    <div v-if="isMerchantOperator && supportKDong" class="form-ad__exchange-rate">
      <exchange-rate-section
        :asset-name="assetName"
        :fiat-symbol="fiatSymbol"
        :decimal-limit="decimalLimit"
        :post-type="adType"
        @apply-exchange-rate="updateRecommendPrice"
        @get-exchange-rate="getExchangeRate"
        @on-change-percent="onChangePercent"
      />
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';
import { mapActions, mapState } from 'vuex';
import CryptoInput from '@/components/common/home/crypto-input.vue';
import { MODAL } from '@/resources/modal.js';
import { ORDER_TYPE } from '@/resources/order-type.js';
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import { BANK } from '@/resources/bank.js'
import { LIST_STATUS, MIN_PRICE, QUOTED_MIN_PRICE } from '@/constants/posts.js'
import { MASTER_DATA_COMMON_DEFAULT, POST_TYPE, USER_ROLE } from '@/config/constant';
import supportedAssetMixin from '@/mixins/supported-asset';
import { NETWORK_CONFIGS } from '@/resources/wallet';

export default {
  components: {
    CryptoInput,
    BaseButton: () => import('~/components/common/base-button/index.vue'),
    BankListPaymentMethodSelector: () => import('~/components/common/bank-selector.vue'),
    ExchangeRateSection: () => import('~/components/common/forms/exchange-rate/index.vue')
  },
  mixins: [supportedAssetMixin],
  props: {
    isManager: {
      type: Boolean,
      default: false
    },
    adType: {
      type: String,
      default: ORDER_TYPE.BUY
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isClonePost: {
      type: Boolean,
      default: false
    },
    adEditInfo: {
      type: Object,
      default: () => ({})
    },
    balance: {
      type: Number,
      default: 0
    },
    commonMasterData: {
      type: Object,
      default: () => ({})
    },
    levelFee: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ORDER_TYPE,
      BANK,
      MODAL,
      LIST_STATUS,
      MIN_PRICE,
      asset: 1,
      fiat: 1,
      showAd: 1,
      paymentMethodId: '',
      amountAsset: '',
      maxFiat: '',
      minFiat: '',
      note: '',
      price: '',
      time: '',
      bankName: this.adEditInfo?.paymentMethod?.paymentMethodFields.find(object => object.contentType === 'bank')?.value.toLowerCase() || '',
      placeholderAmountAsset: '0.00',
      maxFiatError: false,
      minFiatError: false,
      isError: false
    };
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('payments', ['payments', 'selectedPayment']),
    ...mapState('resources', ['assets', 'fiats']),
    ...mapState('post', ['prices']),
    supportKDong () {
      return this.assetNetwork !== NETWORK_CONFIGS.KDONG.nativeCurrency.name
    },
    isMerchantOperator () {
      return this.user?.type === USER_ROLE.MERCHANT_OPERATOR;
    },
    availableAmountTitle () {
      return this.adType === ORDER_TYPE.BUY ? this.$t('create_ad.amount_buy') : this.$t('create_ad.amount_sell')
    },
    validateTitle () {
      return this.adType === ORDER_TYPE.BUY ? this.$t('order_filter.crypto_buy') : this.$t('order_filter.crypto_sell')
    },
    availableFiatTitle () {
      return this.adType === ORDER_TYPE.BUY ? this.$t('create_ad.fiat_send') : this.$t('create_ad.fiat_reveice')
    },
    fiatSymbol () {
      return this.fiats.find(e => e.id === this.fiat)?.symbol
    },
    getBankName () {
      return BANK.find(e => e.bankName === this.selectedPayment?.bankName)?.name;
    },
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset)?.precision || 0
    },
    assetUnit () {
      return this.assets.find(item => item.id === this.asset)?.symbol || ''
    },
    assetName () {
      return this.assets.find(item => item.id === this.asset)?.name || ''
    },
    assetCryptoName () {
      return `${this.assetName} (${this.assetNetwork})`
    },
    assetNetwork () {
      return this.assets.find(item => item.id === this.asset)?.network || ''
    },
    isUnSupportedWallet () {
      return !this.assetName && !this.assetNetwork
    },
    priceAfter () {
      const price = this.price.replace(/,/g, '')
      const fee = new BigNumber(1).plus(Number(this.feeTransaction)).toNumber()
      if (price === '') {
        return 0
      }
      const roundingDownAmount = this.$options.filters.formatCrypto(new BigNumber(price).dividedBy(fee).toNumber(), this.decimalLimit, 'floor')
      const roundingUpAmount = this.$options.filters.formatCrypto(new BigNumber(price).multipliedBy(fee).toNumber(), this.decimalLimit, 'ceil')
      return this.adType === this.ORDER_TYPE.BUY
        ? this.$options.filters.formatMarkToNumber(roundingDownAmount)
        : this.$options.filters.formatMarkToNumber(roundingUpAmount)
    },
    transactionFeePercent () {
      return BigNumber(this.feeTransaction).multipliedBy(100).toNumber()
    },
    punishFeePercent () {
      return BigNumber(this.penaltyFee).multipliedBy(100).toNumber()
    },
    transactionFee () {
      const price = this.price?.replace(/,/g, '')
      const checkPrice = this.adType === this.ORDER_TYPE.BUY ? Number(this.priceAfter) : Number(price)
      return new BigNumber(this.$options.filters.formatMarkToNumber(this.amountAsset))
        .multipliedBy(checkPrice).multipliedBy(Number(this.feeTransaction)).toNumber()
    },
    punishFee () {
      const price = this.price?.replace(/,/g, '')
      const checkPrice = this.adType === this.ORDER_TYPE.BUY ? Number(this.priceAfter) : Number(price)
      return new BigNumber(this.$options.filters.formatMarkToNumber(this.amountAsset))
        .multipliedBy(checkPrice).multipliedBy(Number(this.penaltyFee)).toNumber()
    },
    disabledSubmit () {
      return !this.amountAsset ||
        !this.minFiat ||
        !this.maxFiat ||
        (isEmpty(this.selectedPayment) && this.adType === this.ORDER_TYPE.SELL) ||
        this.minFiatError ||
        this.maxFiatError ||
        !Number(this.$options.filters.formatMarkToNumber(this.price)) ||
        this.isError ||
        !this.asset
    },
    actuallyAmount () {
      const amountAsset = this.$options.filters.formatMarkToNumber(this.amountAsset)
      return Math.round(new BigNumber(Number(this.priceAfter)).multipliedBy(Number(amountAsset)).toNumber())
    },
    actuallyMin () {
      if (this.priceAfter <= 0) {
        return 0
      }
      const value = new BigNumber(this.$options.filters.formatMarkToNumber(this.minFiat)).dividedBy(this.priceAfter).toNumber()
      return this.$options.filters.formatCrypto(value, 3, 'ceil');
    },
    actuallyMax () {
      if (this.priceAfter <= 0) {
        return 0
      }
      const value = new BigNumber(this.$options.filters.formatMarkToNumber(this.maxFiat)).dividedBy(this.priceAfter).toNumber()
      return this.$options.filters.formatCrypto(value, 3, 'ceil');
    },
    buttonName () {
      return this.isEdit ? this.$t('form_post.button.update') : this.$t('form_post.button.post')
    },
    classTooltipPrice () {
      return this.$device.isDesktop ? '' : 'tooltip-price-mb'
    },
    priceMarket () {
      return this.adType === this.ORDER_TYPE.BUY ? this.$t('form_post.label.price_max') : this.$t('form_post.label.price_min')
    },
    tooltipPriceMarket () {
      return this.adType === this.ORDER_TYPE.BUY ? this.$t('form_post.tooltip.max_price') : this.$t('form_post.tooltip.min_price')
    },
    isBuyPostType () {
      return this.adType === POST_TYPE.BUY
    },
    tooltipTrigger () {
      return this.$device.isMobileOrTablet ? 'focus' : 'hover'
    },
    quotedMinPrice () {
      let price;
      if (this.prices?.length) {
        price = this.prices.find(e => e.assetId === this.asset && e.postType === this.adType)?.price
      }
      const key = `${this.assetName}_${this.assetNetwork}`
      return price || QUOTED_MIN_PRICE[key.toUpperCase()] || MIN_PRICE
    },
    maxPostLimit () {
      return Number(this.commonMasterData?.data?.maxPostLimit || 0) || MASTER_DATA_COMMON_DEFAULT.MAX_POST_LIMIT
    },
    minPostLimit () {
      return Number(this.commonMasterData?.data?.minPostLimit || 0) || MASTER_DATA_COMMON_DEFAULT.MIN_POST_LIMIT
    },
    maxOrderLimit () {
      return Number(this.commonMasterData?.data?.maxOrderLimit || 0) || MASTER_DATA_COMMON_DEFAULT.MAX_ORDER_LIMIT
    },
    minOrderLimit () {
      return Number(this.commonMasterData?.data?.minOrderLimit || 0) || MASTER_DATA_COMMON_DEFAULT.MIN_ORDER_LIMIT
    },
    errorMaxValueText () {
      if (!this.checkMinMaxFiatIsValid()) {
        return this.$t('form_post.error.max_value_less_than_min_value')
      }
      return this.$t('form_post.error.max_value_range', {
        value: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.maxOrderLimit)}`
      })
    },
    postTypeText () {
      return this.isBuyPostType ? this.$t('common.buy') : this.$t('common.sell')
    },
    errorMinAvailableAmount () {
      return this.$t('form_post.error.min_value_less_than_available_value', {
        type: this.postTypeText.toLowerCase()
      })
    },
    errorMaxAvailableAmount () {
      return this.$t('form_post.error.max_value_less_than_available_value', {
        type: this.postTypeText.toLowerCase()
      })
    },
    errorMinValueText () {
      if (!this.checkMinMaxFiatIsValid()) {
        return this.$t('form_post.error.min_value_more_than_max_value')
      }
      return this.$t('form_post.error.min_fiat', {
        value: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.minOrderLimit)}`
      })
    },
    errorMinInputMaxFiatText () {
      if (!this.checkMinMaxFiatIsValid()) {
        return this.$t('form_post.error.max_value_less_than_min_value')
      }
      return this.$t('form_post.error.max_fiat', {
        value: `${this.fiatSymbol} ${this.$options.filters.formatMoney(this.minOrderLimit)}`
      })
    },
    transactionTimes () {
      return this.adType === this.ORDER_TYPE.SELL
        ? this.commonMasterData?.data?.userToMerchantTimeBuys || []
        : this.commonMasterData?.data?.userToMerchantTimeSells || []
    },
    feeTransaction () {
      return this.levelFee || 0
    },
    penaltyFee () {
      return this.commonMasterData?.data?.penaltyFee || 0
    },
    bankSelected () {
      return this.payments.length ? this.payments.find(bank => bank.id === this.paymentMethodId) : null
    },
    isHasSelectedPayment () {
      return !isEmpty(this.selectedPayment)
    },
    placeholderMinFiat () {
      return `≥ ${this.$options.filters.formatMoney(this.minOrderLimit)}`
    },
    placeholderMaxFiat () {
      return `≤ ${this.$options.filters.formatMoney(this.maxOrderLimit)}`
    },
    assetsFormatter () {
      return orderBy(this.assetsSupportedMapped, ['orderNumber', 'desc']).filter(item => !item.disabled);
    }
  },
  watch: {
    transactionTimes: {
      handler () {
        if (!this.isEdit) {
          this.time = this.transactionTimes[0]
        }
      },
      immediate: true
    },
    amountAsset: {
      handler (value) {
        if (this.minFiat && this.maxFiat) {
          this.$refs.minFiat?.checkValid()
          this.$refs.maxFiat?.checkValid()
        }
      }
    }
  },
  mounted () {
    this.initAdEditInfo()
    this.initAdCloneInfo()
    this.changeAsset(this.assetsFormatter[0])
    this.changeFiat(this.fiats[0])
  },
  async created () {
    await this.recommendPrice()
    if (!this.isEdit && isEmpty(this.adEditInfo)) {
      this.setPrice()
    }
  },
  beforeDestroy () {
    this.setSelectedPayment({})
  },
  methods: {
    ...mapActions('payments', ['setSelectedPayment']),
    ...mapActions('post', ['recommendPrice']),
    formatPrice (key, limit = 6) {
      if (this.$options.filters.formatMarkToNumber(this[key])) {
        this[key] = this.$options.filters.formatCrypto(this[key], limit, 'round');
      }
    },
    setPrice () {
      this.price = this.calculatePriceDesirable(this.quotedMinPrice)?.toString()
    },
    onError ({ error }) {
      this.isError = error
    },
    onMinFiatError ({ error }) {
      this.minFiatError = error
    },
    onMaxFiatError ({ error }) {
      this.maxFiatError = error
    },
    checkMinMaxFiatIsValid () {
      if (this.minFiat && this.maxFiat) {
        const minFiatAmount = this.$options.filters.formatMarkToNumber(this.minFiat)
        const maxFiatAmount = this.$options.filters.formatMarkToNumber(this.maxFiat)
        return maxFiatAmount > minFiatAmount
      }
      return true;
    },
    updatePrice (method) {
      const priceNumber = this.$options.filters.formatMarkToNumber(this.price)
      let price = 0
      if (method === 'plus') {
        price = Math.round((priceNumber * Math.pow(10, this.decimalLimit) + 1)) / Math.pow(10, this.decimalLimit)
      } else {
        price = Math.round((priceNumber * Math.pow(10, this.decimalLimit) - 1)) / Math.pow(10, this.decimalLimit)
      }
      const pricePositive = price > 0 ? price : 0
      this.price = this.$options.filters.formatCrypto(pricePositive.toString(), this.decimalLimit, 'round')
    },
    formatterNote (note) {
      return String(note).substring(0, 300);
    },
    submit () {
      if (!this.disabledSubmit) {
        const formData = {
          postType: this.adType,
          assetId: this.asset,
          fiatId: this.fiat,
          paymentMethodId: this.adType === this.ORDER_TYPE.SELL ? this.selectedPayment.id : null,
          userToMerchantTime: Number(this.time),
          fixedPriceBeforeFee: this.price,
          priceAfter: this.$options.filters.formatCrypto(this.priceAfter, this.decimalLimit, 'ceil'),
          availableAmount: this.amountAsset,
          lowerFiatLimit: this.minFiat,
          upperFiatLimit: this.maxFiat,
          showAd: this.showAd,
          merchantNote: this.note,
          title: this.isEdit ? this.$t('update_post.title') : this.$t('create_post.title')
        }
        this.$emit('on-submit', formData)
      }
    },
    initAdCloneInfo () {
      this.$nextTick(() => {
        if (this.isClonePost && !isEmpty(this.adEditInfo)) {
          this.amountAsset = this.$options.filters.formatCrypto(this.adEditInfo?.totalAmount || 0) // clone
          this.placeholderAmountAsset = this.$options.filters.formatCrypto(this.adEditInfo?.totalAmount || 0)

          this.setInitDataPostInfo()
          this.$emit('on-update-balance', this.asset)
        }
      })
    },
    setInitDataPostInfo () {
      const asset = this.assets.find(item => item.id === this.adEditInfo?.assetId)
      const fiat = this.fiats.find(item => item.id === this.adEditInfo?.fiatId)
      const status = LIST_STATUS.find(item => item.name === this.adEditInfo?.status?.toLowerCase())
      this.time = this.adEditInfo.userToMerchantTime
      this.paymentMethodId = this.adEditInfo?.paymentMethodId
      this.note = this.adEditInfo.note
      this.price = this.$options.filters.formatCrypto(this.adEditInfo?.price, asset?.precision, 'round')
      this.fiat = fiat?.id
      this.asset = asset?.id
      this.showAd = status ? status.id : LIST_STATUS[0].id
      this.setSelectedPayment(this.bankSelected)
    },
    initAdEditInfo () {
      this.$nextTick(() => {
        if (this.isEdit && !isEmpty(this.adEditInfo)) {
          this.amountAsset = this.$options.filters.formatCrypto(this.adEditInfo.availableAmount) // edit
          this.maxFiat = this.$options.filters.formatMoney(this.adEditInfo.upperFiatLimit) // edit
          this.minFiat = this.$options.filters.formatMoney(this.adEditInfo.lowerFiatLimit) // edit

          this.setInitDataPostInfo()
          this.changeAsset({ id: this.asset })
          this.changeFiat({ id: this.fiat })
        }
      })
    },
    changeAsset (item) {
      if (!this.isEdit) {
        this.asset = item?.id
        this.price = this.calculatePriceDesirable(this.quotedMinPrice)?.toString()
        this.formatPrice('price', this.decimalLimit)
        this.$emit('on-update-balance', this.asset)
      } else {
        this.$emit('on-update-balance', this.asset)
      }
    },
    changeFiat (item) {
      if (!this.isEdit) {
        this.fiat = item?.id
      }
    },
    updateRecommendPrice (price) {
      this.price = this.$options.filters.formatCrypto(price, this.decimalLimit, 'round')
    },
    getExchangeRate (price) {
      this.$emit('on-get-benchmark-price', price)
    },
    onChangePercent (percent) {
      this.$emit('on-change-percent', percent)
    },
    cancel () {
      this.$router.push(this.isManager ? '/merchant-manager/postings' : '/merchant/postings')
    },
    calculatePriceDesirable (price) {
      const fee = new BigNumber(1).plus(Number(this.feeTransaction)).toNumber()
      if (price === '') {
        return price
      }
      const roundingDownAmount = this.$options.filters.formatCrypto(new BigNumber(price).dividedBy(fee).toNumber(), this.decimalLimit, 'floor')
      const roundingUpAmount = this.$options.filters.formatCrypto(new BigNumber(price).multipliedBy(fee).toNumber(), this.decimalLimit, 'ceil')
      return this.adType === this.ORDER_TYPE.BUY
        ? roundingUpAmount
        : roundingDownAmount
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/forms/form-ad.scss" />
<style lang="scss">
.input-min-post-limit {
  div {
    .error {
      padding-top: 15px;
    }
  }
}
</style>
