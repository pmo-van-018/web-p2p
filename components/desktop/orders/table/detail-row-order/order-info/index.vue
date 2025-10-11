<template>
  <div class="detail-card">
    <div class="title">{{ $t('merchant.transaction_detail.transaction_info') }}</div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.amount_money') }}</div>
      <div v-if="orderDetail.postType === ORDER_TYPE.BUY" class="value bullish-green font-t20b">{{ amountMoney | formatMoney }} {{ fiat }}</div>
      <div v-else class="value bearish-red font-t20b">{{ amountMoney | formatMoney }} {{ fiat }}</div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.rate') }}</div>
      <div class="value">{{ price }} {{ fiat }}</div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.amount_cryptocurrencies') }}</div>
      <div class="value font-t20b">{{ amountCryptoCurrencies }} {{ asset }}</div>
    </div>
    <div class="row-info">
      <div class="label">
        {{ $t('merchant.transaction_detail.transaction_fee') }} <span id="transaction-fee-note" class="icon-info" />
        <b-tooltip target="transaction-fee-note" triggers="hover">
          <span class="transaction-fee-note">{{ $t('merchant.transaction_detail.transaction_fee_note') }}</span>
        </b-tooltip>
      </div>
      <div class="value">0%</div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.total_fee') }}</div>
      <div class="value">₫ 0</div>
    </div>
  </div>
</template>
<script>
import { ORDER_TYPE } from '@/resources/order-type.js';
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller';
export default {
  props: {
    orderDetail: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      STATUS_ORDER_BUY,
      ORDER_TYPE
    }
  },
  computed: {
    fiat () {
      return this.orderDetail.fiat || ''
    },
    asset () {
      return this.orderDetail.asset || ''
    },
    price () {
      return this.orderDetail.price || 0
    },
    amountCryptoCurrencies () {
      return this.orderDetail.amount ? this.$options.filters.formatCrypto(this.orderDetail.amount) : 0
    },
    amountMoney () {
      return this.orderDetail.totalPrice ? this.orderDetail.totalPrice : 0
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-info.scss" />
