<template>
  <div :class="['detail-card', { 'none-border': noBorder }]">
    <div class="title">{{ $t('merchant.transaction_detail.transaction_info') }}</div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.amount_money') }}</div>
      <div
        v-if="orderDetail.type === TRADE_TYPE.BUY"
        class="value bullish-green font-t20b"
      >
        {{ fiatSymbol }} {{ amountMoney | formatMoney }}
      </div>
      <div v-else class="value bearish-red font-t20b">{{ fiatSymbol }} {{ amountMoney | formatMoney }}</div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.rate') }}</div>
      <div class="value">{{ fiatSymbol }} {{ price | formatCrypto(decimalLimit, 'ceil') }}</div>
    </div>
    <div class="row-info">
      <div class="label">{{ $t('merchant.transaction_detail.amount_cryptocurrencies') }}</div>
      <div class="value font-t20b">{{ amountCryptoCurrencies }} {{ assetName }}</div>
    </div>
    <div class="row-info">
      <div class="label">
        {{ transactionFeeTitle }} <span id="transaction-fee-note" class="icon-info" />
        <b-tooltip target="transaction-fee-note" triggers="hover">
          <span class="transaction-fee-note">{{ $t('merchant.transaction_detail.transaction_fee_note') }}</span>
        </b-tooltip>
      </div>
      <div class="value">{{ feeInfo }}</div>
    </div>
    <div class="row-info">
      <div class="label">
        {{ penaltyFeeTitle }} <span id="penalty-fee" class="icon-info" />
        <b-tooltip target="penalty-fee" triggers="hover">
          <span class="transaction-fee-note">{{ $t('merchant.transaction_detail.transaction_penalty_fee_note') }}</span>
        </b-tooltip>
      </div>
      <div class="value">{{ penaltyFeeInfo }}</div>
    </div>
  </div>
</template>
<script>
import { STATUS_ORDER_BUY } from '@/resources/transfer-to-seller/index.js';
import BigNumber from 'bignumber.js'
import { ORDER_STATUS, TRADE_TYPE } from '@/config/constant';
import { mapState } from 'vuex';
export default {
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
  data () {
    return {
      STATUS_ORDER_BUY,
      TRADE_TYPE
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.assetName && item.network === this.assetNetwork)
    },
    orderType () {
      // TODO: need remove when integrate order module
      if (this.orderDetail?.postType) {
        return this.orderDetail?.postType === TRADE_TYPE.BUY ? TRADE_TYPE.SELL : TRADE_TYPE.BUY
      }
      return this.orderDetail?.type
    },
    assetName () {
      return this.orderDetail?.assetName || ''
    },
    assetNetwork () {
      return this.orderDetail?.assetNetwork || ''
    },
    fiatSymbol () {
      return this.orderDetail?.fiatSymbol || ''
    },
    price () {
      return this.orderDetail?.price || 0
    },
    amountCryptoCurrencies () {
      return this.orderDetail?.amount ? this.$options.filters.formatCrypto(this.orderDetail.amount) : 0
    },
    amountMoney () {
      return this.orderDetail?.totalPrice || 0
    },
    fee () {
      return new BigNumber(Number(this.orderDetail?.feePercent || 0)).multipliedBy(100).toString()
    },
    totalFee () {
      const order = this.orderDetail || {}
      let totalFeeTmp = 0;
      if (this.orderDetail?.type === TRADE_TYPE.BUY) {
        totalFeeTmp = new BigNumber(order.totalPrice)
          .multipliedBy(order.feePercent)
          .dividedBy(new BigNumber(1).plus(order.feePercent))
          .toNumber();
      }
      if (this.orderDetail?.type === TRADE_TYPE.SELL) {
        totalFeeTmp = new BigNumber(order.totalPrice).multipliedBy(order.feePercent).toNumber();
      }
      return order.totalFee || totalFeeTmp
    },
    feeInfo () {
      if (this.isFinishOrder && !this.orderDetail?.totalFee) {
        return '-'
      }
      return `${this.fee}% (${this.totalFee ? '~' : ''} ${this.fiatSymbol} ${this.$options.filters.formatUpMoney(this.totalFee)})`
    },
    penaltyFee () {
      return new BigNumber(Number(this.orderDetail?.penaltyFeePercent || 0)).multipliedBy(100).toString()
    },
    totalPenaltyFee () {
      const totalPenaltyFeeTmp = new BigNumber(Number(this.orderDetail?.penaltyFeePercent || 0)).multipliedBy(Number(this.orderDetail?.totalPrice || 0)).toNumber()
      return this.orderDetail?.totalPenaltyFee || totalPenaltyFeeTmp
    },
    penaltyFeeInfo () {
      if (this.isFinishOrder && !this.orderDetail?.totalPenaltyFee) {
        return '-'
      }
      return `${this.penaltyFee}% (${this.totalPenaltyFee ? '~' : ''} ${this.fiatSymbol} ${this.$options.filters.formatUpMoney(this.totalPenaltyFee)})`
    },
    isFinishOrder () {
      return [ORDER_STATUS.CANCELLED, ORDER_STATUS.COMPLETED].includes(this.orderDetail?.status)
    },
    transactionFeeTitle () {
      return this.isFinishOrder ? this.$t('merchant.transaction_detail.transaction_fee') : this.$t('merchant.transaction_detail.transaction_fee_tmp')
    },
    penaltyFeeTitle () {
      return this.isFinishOrder ? this.$t('merchant.transaction_detail.penalty_fee') : this.$t('merchant.transaction_detail.penalty_fee_tmp')
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/merchant/order-detail/order-info.scss" />
