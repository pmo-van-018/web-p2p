<template>
  <div class="order-status">
    <div
      :class="[
        'order-status__inner',
        statusClass
      ]"
    >
      {{ statusText }}
    </div>
  </div>
</template>
<script>
import { ORDER_STATUS, POST_TYPE } from '@/config/constant'
import { ORDER_STATUS_CLASS_NAME } from '@/constants/orders';

export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    reversedType: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    postType () {
      // TODO: need to improve when integrate new order module
      if (!this.order.postType) {
        return this.order.type === POST_TYPE.BUY ? POST_TYPE.SELL : POST_TYPE.BUY
      }
      return this.order.postType
    },
    status () {
      return this.order?.status || ''
    },
    statusClass () {
      switch (this.status) {
        case ORDER_STATUS.TO_BE_PAID:
          return ORDER_STATUS_CLASS_NAME.TO_BE_PAID
        case ORDER_STATUS.PAID:
          return ORDER_STATUS_CLASS_NAME.PAID
        default:
          return ''
      }
    },
    assetFiatText () {
      if (this.reversedType) {
        return this.postType === POST_TYPE.BUY ? 'Fiat' : 'Crypto'
      }
      return this.postType === POST_TYPE.BUY ? 'Crypto' : 'Fiat'
    },
    statusText () {
      return {
        [ORDER_STATUS.TO_BE_PAID]: this.$t('common.status.undelivered_money', {
          name: this.assetFiatText
        }),
        [ORDER_STATUS.PAID]: this.$t('common.status.delivered_money', {
          name: this.assetFiatText
        }),
        [ORDER_STATUS.COMPLETED]: this.$t('common.status.complete'),
        [ORDER_STATUS.CANCELLED]: this.$t('common.status.cancelled')
      }[this.status]
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/status/index.scss"></style>
