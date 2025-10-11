<template>
  <div class="order-trans-code">
    <div class="order-trans-code__content">
      <span>{{ transCode }}</span>
      <copy-button :id="`copy-trans-code-${orderId}`" :value="transCode" />
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
    transCode: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-trans-code.scss">
</style>
