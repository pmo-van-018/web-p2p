<template>
  <div class="order-info">
    <div class="order-info__container">
      <template v-if="transactions.length">
        <transaction
          v-for="(transaction, index) in transactions"
          :key="index"
          :transaction="transaction"
        />
      </template>
      <template v-else>
        <transaction>
          <template #title>
            <div class="d-flex flex-column">
              <div class="font-t12b grey-900">{{ $t('admin.transaction_title') }}</div>
              <div class="font-t12r grey-400">{{ $t('admin.no_transaction') }}</div>
            </div>
          </template>
        </transaction>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    Transaction: () => import('~/components/desktop/merchant/order-detail/transaction/index.vue')
  },
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    transactions () {
      return this.order?.transactions || []
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/order-detail/info.scss">
</style>
