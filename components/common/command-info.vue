<template>
  <div class="command-info" :class="className">
    <InfoLabel
      :title="$t('transfer_seller.waiting.command_info.amount_money')"
      :value="fiat"
      class="command-info__item"
      :class="[className, classStyleCard]"
      :value-class="isBuyOrder ? 'green' : 'red'"
    />
    <InfoLabel
      :title="$t('transfer_seller.waiting.command_info.rate')"
      class="command-info__item"
      :class="[className, classStyleCard]"
      :value="priceFormatter"
    />
    <InfoLabel
      :title="$t('transfer_seller.waiting.command_info.amount_encode_money')"
      class="command-info__item"
      :class="[className, classStyleCard]"
      :value="amount"
      :asset-format="assetFormat"
    />
  </div>
</template>

<script>
import InfoLabel from '@/components/common/info-label.vue';
import { ORDER_TYPE } from '@/resources/order-type.js';
import { mapState } from 'vuex';
export default {
  components: {
    InfoLabel
  },
  props: {
    orderInfo: {
      type: Object,
      default: () => {}
    },
    className: {
      type: String,
      default: ''
    },
    styleCard: {
      type: String,
      default: ''
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
    },
    assetFormat () {
      return `<span>${this.orderInfo?.assetName || ''}</span>(${this.orderInfo?.assetNetwork})`
    },
    classStyleCard () {
      return {
        grey: 'grey-card'
      }[this.styleCard] || null
    }
  }
};
</script>
<style lang="scss" scoped src="static/assets/scss/components/common/command-info.scss" />
