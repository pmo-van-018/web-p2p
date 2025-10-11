<template>
  <div class="order-amount">
    <div class="order-amount__inner">
      <div class="order-amount__fiat">
        <div :class="['order-amount__fiat-value']">
          <span>{{ fiatSymbol }}</span> {{ totalPrice | formatMoney }}
        </div>
        <div class="order-amount__fiat-copy">
          <copy-button :id="`copy-fiat-amount-${orderId}`" :value="totalPrice" />
        </div>
      </div>
      <div class="order-amount__asset">
        {{ amountCrypto | formatCrypto }} {{ assetName }}
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
    CopyButton: () => import('@/components/common/copy-button.vue')
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    fiatSymbol: {
      type: String,
      default: ''
    },
    assetName: {
      type: String,
      default: ''
    },
    amountCrypto: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-amount.scss">
</style>
