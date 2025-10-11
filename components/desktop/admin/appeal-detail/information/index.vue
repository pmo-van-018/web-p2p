<template>
  <section class="information">
    <order-info :order-detail="order" no-border />
    <order-method
      :order-detail="order"
      no-border
      is-show-all
      disable-payment-status-completed
      :is-show-qr-code="false"
    />
    <div class="transactions">
      <div class="title">{{ $t('admin.transaction_title') }}</div>
      <div class="transaction-list">
        <transaction :transaction="order.transaction || null" />
      </div>
    </div>
  </section>
</template>
<script>
export default {
  components: {
    OrderInfo: () => import('~/components/desktop/admin/appeal-detail/order-info/index.vue'),
    OrderMethod: () => import('~/components/desktop/merchant/order-detail/order-method.vue'),
    Transaction: () => import('~/components/desktop/merchant/order-detail/transaction/index.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/admin/appeal-detail/information/index.scss">
</style>
