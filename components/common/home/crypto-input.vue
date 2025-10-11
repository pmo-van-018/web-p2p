<template>
  <div class="crypto-input">
    <BaseInputLabel
      :id="id"
      :key="key"
      ref="trasaction-crypto-input"
      v-model="inputValue"
      :required="required"
      class-option="error--outline"
      :class="{'is-text-buy-all': buyAll}"
      :placeholder="placeholder"
      :error-required="errorRequired"
      :label="label"
      :thousands-separator-symbol="thousandsSeparatorSymbol"
      :max-value="maxValue"
      :min-value="minValue"
      :limit-input="limitInput"
      :disabled="disabled"
      :error-min-value="errorMinValue"
      :error-max-value="errorMaxValue"
      :unit="unit"
      :type="type"
      :allow-decimal="allowDecimal"
      :decimal-limit="decimalLimit"
      :label-require="labelRequire"
      :allow-leading-zeroes="allowLeadingZeroes"
      :is-show-label="isShowLabel"
      :min-fiat="minFiat"
      :max-fiat="maxFiat"
      :name="name"
      :price-after="priceAfter"
      :min-available-amount="minAvailableAmount"
      :max-available-amount="maxAvailableAmount"
      :error-min-available-amount="errorMinAvailableAmount"
      :error-max-available-amount="errorMaxAvailableAmount"
      @input="$emit('input', $event)"
      @blur="$emit('blur', $event)"
      @error="$emit('error', $event)"
    />
    <div class="crypto-input__right" :class="{ 'crypto-input__right--top': !isShowLabel }">
      <div v-if="buyAll" class="crypto-input__buy-all" @click="buyAllCrypto">{{ $t('home.buy-all') }}</div>
      <div v-if="sellAll" class="crypto-input__sell-all" @click="sellAllCrypto">{{ $t('home.sell-all') }}</div>
      <div class="crypto-input__unit-display">{{ unit }}</div>
    </div>
  </div>
</template>

<script>
import BaseInputLabel from '@/components/common/base-input-label.vue'

export default {
  components: { BaseInputLabel },
  props: {
    id: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'tel'
    },
    maxValue: {
      type: Number,
      default: 1000000
    },
    minValue: {
      type: Number,
      default: 5000
    },
    minFiat: {
      type: String,
      default: ''
    },
    maxFiat: {
      type: String,
      default: ''
    },
    limitInput: {
      type: Number,
      default: undefined
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    thousandsSeparatorSymbol: {
      type: String,
      default: ','
    },
    errorRequired: {
      type: String,
      default: ''
    },
    errorMinValue: {
      type: String,
      default: ''
    },
    errorMaxValue: {
      type: String,
      default: ''
    },
    buyAll: {
      type: Boolean,
      default: false
    },
    sellAll: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: ''
    },
    allowDecimal: {
      type: Boolean,
      default: false
    },
    decimalLimit: {
      type: Number,
      default: 2
    },
    allowLeadingZeroes: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    },
    labelRequire: {
      type: String,
      default: ''
    },
    isShowLabel: {
      type: Boolean,
      default: true
    },
    priceAfter: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    minAvailableAmount: {
      type: Number,
      default: 0
    },
    maxAvailableAmount: {
      type: Number,
      default: 0
    },
    errorMinAvailableAmount: {
      type: String,
      default: ''
    },
    errorMaxAvailableAmount: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      inputValue: this.value,
      key: 0
    }
  },
  watch: {
    value (newValue) {
      this.inputValue = newValue
    },
    decimalLimit (newValue) {
      this.key = newValue
    }
  },
  methods: {
    buyAllCrypto () {
      this.$emit('buyAllCrypto')
      this.$refs['trasaction-crypto-input'].validate();
    },
    sellAllCrypto () {
      this.$emit('sell-all-crypto')
      this.$refs['trasaction-crypto-input'].validate();
    },
    checkValid () {
      this.$refs['trasaction-crypto-input'].validate();
      return this.$refs['trasaction-crypto-input'].checkValid();
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/home/crypto-input.scss"></style>
