<template>
  <div class="order-info">
    <div class="order-info__container">
      <div class="order-info__inner">
        <div class="order-info__title">
          {{ $t('transfer_seller.waiting.command_info.amount_money') }}
        </div>
        <div class="order-info__value" :class="isBuyOrder ? 'buy' : 'sell'">
          {{ fiat }}
        </div>
      </div>

      <div class="order-info__inner">
        <div class="order-info__title">
          {{ $t('transfer_seller.waiting.command_info.rate') }}
        </div>
        <div class="order-info__value">
          {{ priceFormatter }}
        </div>
      </div>

      <div class="order-info__inner">
        <div class="order-info__title">
          {{ $t('transfer_seller.waiting.command_info.amount_encode_money') }}
        </div>
        <div class="order-info__value">
          {{ amount }} {{ orderInfo?.assetName || '' }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ORDER_TYPE } from '@/resources/order-type'

export default {
  props: {
    orderInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState('resources', ['assets']),
    decimalLimit () {
      return this.assets.find(item => item.id === this.asset?.id)?.precision || 0
    },
    asset () {
      return this.assets.find(item => item.name === this.orderInfo?.assetName && item.network === this.orderInfo?.assetNetwork)
    },
    isBuyOrder () {
      return this.orderInfo?.type === ORDER_TYPE.BUY
    },
    fiat () {
      return `${this.orderInfo?.fiatSymbol || ''} ${this.$options.filters.formatMoney(this.orderInfo?.totalPrice || 0)}`
    },
    priceFormatter () {
      const price = this.$options.filters.formatCrypto(this.orderInfo?.price || 0, this.decimalLimit, 'ceil')
      return `${this.orderInfo?.fiatSymbol || ''} ${price}`
    },
    amount () {
      return `${this.$options.filters.formatCrypto(this.orderInfo?.amount || 0)}`
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/mobile/orders/order-info/index.scss">
</style>
