<template>
  <div class="order-waiting" @click="$emit('click')">
    <div class="order-waiting__inner">
      <div class="order-waiting__value">{{ orderCount > 100 ? `+${orderCount}` : orderCount }}</div>
      <span class="order-waiting__icon icon-note-order"></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    orderCount: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/order-waiting-count/index.scss">
</style>
