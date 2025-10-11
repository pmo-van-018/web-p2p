<template>
  <div class="detail-card">
    <div class="title">{{ $t('merchant.transaction_detail.cryptocurrency_trading') }}</div>
    <div v-if="!transactions.length" class="empty">
      <span class="icon-transaction-empty" />
      <div class="empty-text">{{ $t('merchant.transaction_detail.transactions_empty') }}</div>
    </div>
    <div v-else class="row-info">
      <div class="label label-tx">
        TX ID <span id="tx-note" class="icon-info" />
        <b-tooltip target="tx-note" triggers="hover">
          <span class="tx-note">{{ $t('merchant.transaction_detail.tx_note') }}</span>
        </b-tooltip>
      </div>
      <div class="list-tx">
        <div
          v-for="(item, index) in transactions"
          :key="index"
          class="value primary-yellow tx-value"
          @click="$_assetNetwork_openExploreTransactionHash(item.network, item.hash)"
        >
          {{ item.hash | formatHash }}
          <div class="d-flex" v-html="getIcon(item.status)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { STATUS_TRANSACTION } from '@/resources/merchant';
import assetNetworkMixin from '@/mixins/asset-network';

export default {
  mixins: [assetNetworkMixin],
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    transactions () {
      return this.orderDetail.transactions || []
    }
  },
  methods: {
    getIcon (key) {
      return STATUS_TRANSACTION[key].icon
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-info.scss" />
