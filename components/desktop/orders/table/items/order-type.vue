<template>
  <div
    :class="[
      'order-type',
      { 'is-horizontal': isHorizontal }
    ]"
  >
    <div :class="['order-type__name', postTypeClass]">
      {{ postTypeText }}
    </div>
    <div class="order-type__asset-name">
      {{ name }} <span class="order-type__asset-network font-t12m">({{ network }})</span>
    </div>
  </div>
</template>
<script>
import { ORDER_TYPE } from '@/resources/order-type'

export default {
  props: {
    postType: {
      type: String,
      default: ORDER_TYPE.BUY
    },
    name: {
      type: String,
      default: ''
    },
    network: {
      type: String,
      default: ''
    },
    isHorizontal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isPostTypeBuy () {
      return this.postType === ORDER_TYPE.BUY
    },
    postTypeClass () {
      return this.isPostTypeBuy ? 'buy' : 'sell'
    },
    postTypeText () {
      return this.isPostTypeBuy
        ? this.$t('common.buy')
        : this.$t('common.sell')
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-type.scss">
</style>
