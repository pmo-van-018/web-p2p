<template>
  <div class="filter-amount">
    <div class="filter-amount__wrapper">
      <div class="filter-amount__input">
        <crypto-input
          v-model="amountValue"
          :placeholder="$t('order_filter.placeholder_amount')"
          type="tel"
          unit="VND"
          :min-value="null"
          :max-value="null"
          :required="false"
          :allow-decimal="false"
          :allow-leading-zeroes="false"
          @input="$emit('input', $event)"
          @blur="$emit('blur', $event)"
        />
      </div>
      <div class="filter-amount__suggest">
        <div class="suggest-amount">
          <div class="suggest-amount__list">
            <div
              v-for="(item, index) in amountSuggest"
              :key="index"
              class="suggest-amount__item"
              :class="{ active: activeQuick(item.value) }"
              @click="onQuickSelect(item.value)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AMOUNT_SUGGEST } from '~/resources/merchant/orders-filter'

export default {
  components: {
    CryptoInput: () => import('~/components/common/home/crypto-input.vue')
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      amountSuggest: AMOUNT_SUGGEST,
      amountValue: this.value
    }
  },
  watch: {
    value (newValue) {
      this.amountValue = newValue
    }
  },
  methods: {
    activeQuick (value) {
      const amount = this.$options.filters.formatMoney(value)
      return this.amountValue === amount
    },
    onQuickSelect (value) {
      value = this.$options.filters.formatMoney(value)
      this.amountValue = String(value)
      this.$emit('input', value)
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/commons/filters/order-amount/index.scss">
</style>
