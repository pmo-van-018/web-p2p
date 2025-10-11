<template>
  <div class="base-input" :class="[className, { 'base-input--password': type === 'password' }]">
    <label v-if="isShowLabel && label" :class="classLabel">{{ label }}</label>
    <label v-if="subLabel" class="label-right">Khả dụng: <span>{{ moneyAvailiable | formatMoney }} đ</span></label>
    <label v-if="note" class="label-right" :class="noteClass" @click="$emit('actionNote')"><span>{{ note }}</span></label>
    <div v-if="inputType !== 'textarea'" class="base-input__wrap" :class="{ 'focused': isFocus || currentValue, 'input-error': $v.currentValue.$error }">
      <MaskedInput
        v-if="!specialValue"
        :id="id"
        ref="mark"
        v-model="$v.currentValue.$model"
        :class="'form-input input-custom'"
        :mask="inputType === 'tel' || inputType === 'number' ? numberMask :false"
        :type="inputType"
        :name="name"
        :maxlength="limitInput"
        :disabled="disabled"
        :placeholder="formatPlaceholder"
        :autocomplete="autocomplete"
        @blur="onBlur()"
        @focus="onFocus()"
        @focusout="$emit('onFocusOutInput')"
        @keyup="$emit('onKeyUpInput', $event)"
        @focusin="$emit('focusin', $event)"
        @keyup.enter="$emit('onKeyUpEnter', $event)"
      />
      <div v-else :id="id" class="form-special-value" :class="{'text-blur': !$v.currentValue.$model}">
        {{ formatValueWithK }}
      </div>
      <span v-if="type === 'password'" :class="['icon', isShowPassword ? 'icon-open-eye' : 'icon-close-eye']" @click="togglePassword()" />
      <slot v-if="!$v.$error" />
      <template v-if="isShowIcon">
        <slot name="slot-icon" />
      </template>
      <slot name="slot-special" />
    </div>
    <div v-else class="base-input__wrap base-input__wrap--reverse" :class="{ 'focused': isFocus || currentValue, 'input-error': $v.currentValue.$error }">
      <textarea
        v-model.trim="$v.currentValue.$model"
        :class="classInputTextArea"
        :name="name"
        v-bind="$attrs"
        :placeholder="formatPlaceholder"
        @blur="onBlur()"
        @focus="onFocus()"
      />
    </div>
    <p v-if="$v.currentValue.$error" class="error" :class="classError">
      <template v-if="!$v.currentValue.required">{{ formatErrorRequired }}</template>
      <template v-else-if="!$v.currentValue.fullNameCharacter">{{ formatErrorFullNameCharacter }}</template>
      <template v-else-if="!$v.currentValue.alphaNumUnderscoreAndMinus">{{ formatErrorAlphaNumUnderscoreAndMinus }}</template>
      <template v-else-if="!$v.currentValue.minLength">{{ formatErrorMinLength }}</template>
      <template v-else-if="!$v.currentValue.maxLength">{{ formatErrorMaxLength }}</template>
      <template v-else-if="!$v.currentValue.minValue">{{ formatErrorMinValue }}</template>
      <template v-else-if="!$v.currentValue.maxValue">{{ formatErrorMaxValue }}</template>
      <template v-else-if="!$v.currentValue.email">{{ formatErrorEmail }}</template>
      <template v-else-if="!$v.currentValue.sameAs">{{ formatErrorSameAs }}</template>
      <template v-else-if="!$v.currentValue.notSameAs">{{ formatErrorNotSameAs }}</template>
      <template v-else-if="!$v.currentValue.sameAsText">{{ sameAsTextMessage }}</template>
      <template v-else-if="!$v.currentValue.notSameAsText">{{ notSameAsTextMessage }}</template>
      <template v-else-if="!$v.currentValue.specialCharacter">{{ formatErrorSpecicalCharacter }}</template>
      <template v-else-if="!$v.currentValue.specialCharacterLogin">{{ formatErrorSpecicalCharacterLogin }}</template>
      <template v-else-if="!$v.currentValue.checkPhoneNumber">{{ formatErrorCheckPhoneNumber }}</template>
      <template v-else-if="!$v.currentValue.alphaNum">{{ formatErrorAlphaNum }}</template>
      <template v-else-if="!$v.currentValue.isValidWalletAddress">{{ formatErrorInvalidWalletAddress }}</template>
    </p>
    <p v-if="toVnd && currentValue" class="base-input__vnd">= {{ toVdnAmount }} {{ $t("home.unit-vnd") }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import BigNumber from 'bignumber.js';
import { validationMixin } from 'vuelidate'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { required, maxLength, minLength, helpers, email, sameAs, not, numeric, between, alphaNum } from 'vuelidate/lib/validators'
import MaskedInput from 'vue-text-mask'
import { ethers } from 'ethers';
import TRON_API from '@/api/tron';
import { MASTER_DATA_COMMON_DEFAULT } from '~/config/constant';

const specialCharacter = helpers.regex('specialCharacter', /^[a-zA-Z0-9]*$/)
const specialCharacterLogin = helpers.regex('specialCharacter', /^[a-zA-Z0-9_@.-]*$/)
const fullNameCharacter = helpers.regex('fullNameCharacter', /^[A-Z ]*$/)
const alphaNumUnderscoreAndMinus = helpers.regex('alphaNumUnderscoreAndMinus', /^[a-zA-Z0-9_-]+$/)
const checkPhoneFirstNumber = value => value.charAt(0) === '0'
const sameAsText = param => value => value === param
const notSameAsText = param => value => value !== param

export default {
  components: {
    MaskedInput
  },
  mixins: [validationMixin],
  model: {
    prop: 'inputValue',
    event: 'input'
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    classInputTextArea: {
      type: String,
      default: ''
    },
    specialValue: {
      type: Boolean,
      default: false
    },
    isShowIcon: {
      type: Boolean,
      default: false
    },
    sameAs: {
      type: String,
      default: ''
    },
    sameAsText: {
      type: String,
      default: ''
    },
    sameAsTextMessage: {
      type: String,
      default: ''
    },
    notSameAsText: {
      type: String,
      default: ''
    },
    notSameAsTextMessage: {
      type: String,
      default: ''
    },
    moneyAvailiable: {
      type: Number,
      default: 0
    },
    name: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    toVnd: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: ''
    },
    subLabel: {
      type: Boolean,
      default: false
    },
    labelRequire: {
      type: String,
      default: 'Số lượng'
    },
    unit: {
      type: String,
      default: ''
    },
    classLabel: {
      type: String,
      default: ''
    },
    inputValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    blurValidate: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    maxLength: {
      type: Number,
      default: undefined
    },
    minLength: {
      type: Number,
      default: undefined
    },
    maxValue: {
      type: Number,
      default: undefined
    },
    minValue: {
      type: Number,
      default: undefined
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
    thousandsSeparatorSymbol: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    specialCharacter: {
      type: Boolean,
      default: false
    },
    removeAllSpaceSpecialCharacter: {
      type: Boolean,
      default: false
    },
    specialCharacterLogin: {
      type: Boolean,
      default: false
    },
    fullNameCharacter: {
      type: Boolean,
      default: false
    },
    alphaNumUnderscoreAndMinus: {
      type: Boolean,
      default: false
    },
    notSameAs: {
      type: String,
      default: ''
    },
    classError: {
      type: String,
      default: ''
    },
    errorRequired: {
      type: String,
      default: ''
    },
    errorMinLength: {
      type: String,
      default: ''
    },
    errorMaxLength: {
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
    errorSpecialCharacter: {
      type: String,
      default: ''
    },
    errorSpecialCharacterLogin: {
      type: String,
      default: ''
    },
    errorFullNameCharacter: {
      type: String,
      default: ''
    },
    errorAlphaNumUnderscoreAndMinus: {
      type: String,
      default: ''
    },
    checkPhoneNumber: {
      type: Boolean,
      default: false
    },
    errorCheckPhoneNumber: {
      type: String,
      default: ''
    },
    isFormatDash: {
      type: Boolean,
      default: false
    },
    isUpperCase: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    note: {
      type: String,
      default: ''
    },
    noteClass: {
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
      default: true
    },
    alphaNum: {
      type: Boolean,
      default: false
    },
    errorAlphaNum: {
      type: String,
      default: ''
    },
    isWalletAddress: {
      type: Boolean,
      default: false
    },
    errorWalletAddress: {
      type: String,
      default: ''
    },
    priceAfter: {
      type: Number,
      default: 0
    },
    isShowLabel: {
      type: Boolean,
      default: true
    },
    minAvailableAmount: {
      type: Number,
      default: 0
    },
    errorMinAvailableAmount: {
      type: String,
      default: ''
    },
    maxAvailableAmount: {
      type: Number,
      default: 0
    },
    errorMaxAvailableAmount: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      numberMask: createNumberMask({
        prefix: '',
        suffix: this.suffix,
        integerLimit: this.limitInput,
        thousandsSeparatorSymbol: this.thousandsSeparatorSymbol,
        allowLeadingZeroes: this.allowLeadingZeroes,
        allowDecimal: this.allowDecimal,
        decimalLimit: this.decimalLimit
      }),
      isShowPassword: false,
      isFocus: false,
      inputType: this.type,
      isMoreThanAvailableAmount: false,
      isLessThanAvailableAmount: false
    }
  },
  computed: {
    currentValue: {
      get () {
        return this.inputValue
      },
      set (value) {
        if (!this.disabled) {
          this.$emit('input', value)
        }
      }
    },
    toVdnAmount () {
      return this.$options.filters.formatMoney(this.currentValue, 1000)
    },
    formatPlaceholder () {
      let labelFormatted = '';
      if (this.label) {
        labelFormatted = this.formatTextUpCaseByRegexList(`Nhập ${this.label.toLowerCase()}`);
      }

      return this.placeholder || labelFormatted
    },
    formatErrorRequired () {
      let labelRequiredFormatted = '';
      if (this.labelRequire) {
        labelRequiredFormatted = this.formatTextUpCaseByRegexList(`Vui lòng nhập ${this.labelRequire.toLowerCase()}`);
      }

      return this.errorRequired || labelRequiredFormatted
    },
    formatErrorMinLength () {
      return this.errorMinLength ? this.errorMinLength : `Vui lòng không nhập ít hơn ${this.minLength} ${this.type === 'tel' || this.type === 'number' ? 'chữ số' : 'ký tự'}`
    },
    formatErrorMaxLength () {
      return this.errorMaxLength ? this.errorMaxLength : `Vui lòng không nhập nhiều hơn ${this.maxLength} ${this.type === 'tel' || this.type === 'number' ? 'chữ số' : 'ký tự'}`
    },
    formatErrorMinValue () {
      if (this.name === 'minPostLimitFormAd') {
        return this.errorMinValue ? this.errorMinValue : `${this.$t('form_post.error.value_range', { minValue: this.$options.filters.formatMoney(this.minValue), maxValue: this.$options.filters.formatMoney(this.maxValue) })}`
      }
      if (this.isLessThanAvailableAmount) {
        return this.errorMinAvailableAmount
      }
      return this.errorMinValue ? this.errorMinValue : `${this.labelRequire} ${this.$t('form_post.error.minimum_is')} ${this.$options.filters.formatMoney(this.minValue)} ${this.unit}`
    },
    formatLessThanAvailableValue () {
      return this.errorMinValue ? this.errorMinValue : `${this.labelRequire} ${this.$t('form_post.error.minimum_is')} ${this.$options.filters.formatMoney(this.minValue)} ${this.unit}`
    },
    formatErrorMaxValue () {
      if (this.name === 'minPostLimitFormAd') {
        return this.errorMinValue ? this.errorMinValue : `${this.$t('form_post.error.value_range', { minValue: this.$options.filters.formatMoney(this.minValue), maxValue: this.$options.filters.formatMoney(this.maxValue) })}`
      }
      if (this.isMoreThanAvailableAmount) {
        return this.errorMaxAvailableAmount
      }
      return this.errorMaxValue ? this.errorMaxValue : `${this.labelRequire} tối đa là ${this.$options.filters.formatMoney(this.maxValue)} ${this.unit}`
    },
    formatErrorEmail () {
      return this.errorEmail ? this.errorEmail : 'Địa chỉ email không hợp lệ'
    },
    formatErrorSameAs () {
      return this.errorSameAs ? this.errorSameAs : `${this.label} không trùng khớp`
    },
    formatErrorNotSameAs () {
      return this.errorSameAs ? this.errorSameAs : 'Vui lòng nhập mật khẩu không trùng với mật khẩu cũ'
    },
    formatErrorSpecicalCharacter () {
      return this.errorSpecialCharacter ? this.errorSpecialCharacter : `${this.label} không chứa các ký tự đặc biệt`
    },
    formatErrorSpecicalCharacterLogin () {
      return this.errorSpecialCharacterLogin ? this.errorSpecialCharacterLogin : `${this.label} không chứa các ký tự đặc biệt`
    },
    formatErrorFullNameCharacter () {
      return this.errorFullNameCharacter ? this.errorFullNameCharacter : `${this.label} không bao gồm số và các ký tự đặc biệt, viết hoa không dấu`
    },
    formatErrorAlphaNumUnderscoreAndMinus () {
      return this.errorAlphaNumUnderscoreAndMinus ? this.errorAlphaNumUnderscoreAndMinus : `${this.label} chỉ bao gồm chữ hoa, chữ thường, số, kí tự "-" và "_"`
    },
    formatErrorCheckPhoneNumber () {
      return this.errorCheckPhoneNumber ? this.errorCheckPhoneNumber : `${this.label} không hợp lệ`
    },
    formatValueWithK () {
      return this.$v.currentValue.$model ? this.$options.filters.formatNumberWithK(this.$v.currentValue.$model) : this.formatPlaceholder
    },
    formatErrorInvalidWalletAddress () {
      return this.errorWalletAddress ? this.errorWalletAddress : `${this.label} không hợp lệ`;
    },
    formatErrorAlphaNum () {
      return this.errorAlphaNum ? this.errorAlphaNum : `${this.label} chỉ bao gồm chữ hoa, chữ thường và số`;
    }
  },
  watch: {
    currentValue (value) {
      if (!value) {
        this.currentValue = value;
        return;
      }
      if (this.isUpperCase && this.fullNameCharacter) {
        this.currentValue = value.toUpperCase().replace(/ +(?= )/g, '')
      } else if (this.isUpperCase) {
        this.currentValue = value.toUpperCase()
      }
      if (value.length && this.isFormatDash) {
        this.formatWithDash(value)
      } else if (value.length > this.limitInput) {
        let amount = this.$options.filters.formatMarkToNumber(value.slice(0, this.limitInput), 1)
        amount = this.$options.filters.formatMoney(amount)
        this.currentValue = amount
      } else if (this.specialCharacter) {
        this.formatWithSpecialCharacter(value)
      } else if (this.removeAllSpaceSpecialCharacter) {
        this.currentValue = value.replace(/[^0-9a-zA-Z|s+]/g, '')
      }
    },
    '$v.$error': {
      handler (value) {
        this.$emit('error', { name: this.name, error: value })
      }
    }
  },
  validations () {
    return {
      currentValue: {
        required: this.required ? required : true,
        maxLength: this.maxLength ? maxLength(this.maxLength) : true,
        minLength: this.minLength ? minLength(this.minLength) : true,
        specialCharacter: this.specialCharacter ? specialCharacter : true,
        specialCharacterLogin: this.specialCharacterLogin ? specialCharacterLogin : true,
        fullNameCharacter: this.fullNameCharacter ? fullNameCharacter : true,
        alphaNumUnderscoreAndMinus: this.alphaNumUnderscoreAndMinus ? alphaNumUnderscoreAndMinus : true,
        between: this.between ? between(this.between.min, this.between.max) : true,
        alphaNum: this.alphaNum ? alphaNum : true,
        minValue: (value) => {
          const amount = this.$options.filters.formatMarkToNumber(value)
          if (this.name === 'minPostLimitFormAd') {
            return amount >= this.minPostLimitByAssetVND(this.minValue);
          }
          let result = true;
          if (this.maxFiat) {
            const maxFiatAmount = this.$options.filters.formatMarkToNumber(this.maxFiat)
            result = amount < maxFiatAmount
          }
          if (this.minAvailableAmount) {
            result = amount <= this.$options.filters.formatMarkToNumber(this.minAvailableAmount)
            this.isLessThanAvailableAmount = !result
          }
          if (result) {
            result = this.minValue ? amount >= this.minValue : true
          }
          return result;
        },
        maxValue: (value) => {
          const amount = this.$options.filters.formatMarkToNumber(value)
          if (this.name === 'minPostLimitFormAd') {
            return amount <= this.minPostLimitByAssetVND(this.maxValue);
          }
          let result = true;
          if (this.minFiat) {
            const minFiatAmount = this.$options.filters.formatMarkToNumber(this.minFiat)
            result = amount > minFiatAmount
          }
          if (this.maxAvailableAmount) {
            result = amount <= this.$options.filters.formatMarkToNumber(this.maxAvailableAmount)
            this.isMoreThanAvailableAmount = !result
          }
          if (result) {
            result = this.maxValue ? amount <= this.maxValue : true
          }
          return result
        },
        email: this.type === 'email' ? email : true,
        sameAs: this.sameAs ? sameAs(() => this.sameAs) : true,
        notSameAs: this.notSameAs ? not(sameAs(() => this.notSameAs)) : true,
        sameAsText: this.sameAsText ? sameAsText(this.sameAsText) : true,
        notSameAsText: this.notSameAsText ? notSameAsText(this.notSameAsText) : true,
        checkPhoneNumber: (value) => {
          return this.checkPhoneNumber ? checkPhoneFirstNumber(value) && numeric(value) : true
        },
        isValidWalletAddress: async (value) => {
          if (this.isWalletAddress) {
            if (ethers.utils.isAddress(value)) {
              return true;
            }
            if (window.tronWeb) {
              return await window.tronWeb.isAddress(value);
            }
            const { data: response } = await axios.post(TRON_API.VALIDATE_ADDRESS, { address: value, visible: true })
            return response.result;
          }
          return true;
        }
      }
    }
  },
  methods: {
    validate () {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        return this.currentValue
      }
    },
    checkValid () {
      return !this.$v.$invalid
    },
    resetValidate () {
      this.$v.$reset()
    },
    onBlur () {
      this.$emit('blur')
      this.isFocus = false
      if (this.blurValidate) {
        this.$v.$touch()
      }
    },
    onFocus () {
      this.isFocus = true
      this.$emit('focus')
    },
    togglePassword () {
      this.isShowPassword = !this.isShowPassword
      this.inputType = this.isShowPassword ? 'text' : 'password'
    },
    formatWithDash (val) {
      this.currentValue = val.slice(0, this.limitInput).replace(/[^0-9]/g, '').match(/\d{4}(?=\d{1})|\d+/g).join('-')
    },
    formatWithSpecialCharacter (val) {
      this.currentValue = val.replace(/[^0-9a-zA-Z ]/g, '')
    },
    formatTextUpCaseByRegexList (label) {
      const replaceRegexList = ['cskh'];

      replaceRegexList.forEach((item) => {
        const errorTextUpCase = item.toUpperCase();
        if (new RegExp(item).test(label)) {
          label = label.replace(item, errorTextUpCase)
        }
      })

      return label;
    },
    invalidConditionMaxValueByNames () {
      const customTextByNameList = [
        'minOrderLimit',
        'minPostLimit'
      ];
      return customTextByNameList.some(item => item === this.name);
    },
    minPostLimitByAssetVND (value) {
      const formatMinPostLimit = Number(value || 0) || MASTER_DATA_COMMON_DEFAULT.MIN_POST_LIMIT
      return Math.round(new BigNumber(Number(formatMinPostLimit)).dividedBy(Number(this.priceAfter)).toNumber())
    }
  }
}
</script>

<style lang="scss" scoped src="static/assets/scss/components/common/base-input-label.scss"></style>
