<template>
  <div class="order-process">
    <div class="order-process__inner">
      <span class="order-process__icon" :class="order.appealResolved ? 'icon-processed' : 'icon-in-process'"></span>
      <div class="order-process__text" :class="{ 'processed': order?.appealResolved }">
        {{ appealResolved }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    appealResolved () {
      const appealResolvedStatus = this.order?.appealResolved || null
      return appealResolvedStatus ? this.$t('appeal.processed') : this.$t('appeal.in_process');
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-process-status.scss">
</style>
