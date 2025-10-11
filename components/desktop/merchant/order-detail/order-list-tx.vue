<template>
  <div :class="['detail-card', { 'none-border': noBorder }]">
    <div class="title">{{ $t('merchant.transaction_detail.cryptocurrency_trading') }}</div>
    <div v-if="!transactions.length" class="empty">
      <span class="icon-transaction-empty" />
      <div class="empty-text">{{ $t('merchant.transaction_detail.transactions_empty') }}</div>
    </div>
    <div v-else class="detail-card__row">
      <div class="list-tx">
        <cryptocurrency-transaction
          v-for="(item, index) in transactions"
          :key="index"
          :transaction="item"
        />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {
    CryptocurrencyTransaction: () => import('~/components/desktop/commons/cryptocurrency-transaction/index.vue')
  },
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    },
    noBorder: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    transactions () {
      return this.orderDetail.transactions || []
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-info.scss" />
