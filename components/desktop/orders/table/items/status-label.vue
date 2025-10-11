<template>
  <div :class="['status-label', statusClass]">
    <div class="status-label__inner">{{ statusText }}</div>
  </div>
</template>
<script>
import { ORDER_STATUS, POST_TYPE } from '@/config/constant'

export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    postType () {
      return this.order.postType
    },
    statusText () {
      return this.postType === POST_TYPE.BUY ? this.statusSellOrderText : this.statusBuyOrderText
    },
    status () {
      return this.order.status
    },
    statusSellOrderText () {
      return {
        [ORDER_STATUS.TO_BE_PAID]: this.$t('common.status_detail.undelivered_crypto'),
        [ORDER_STATUS.CONFIRM_PAID]: this.$t('common.status_detail.delivered_crypto'),
        [ORDER_STATUS.PAID]: this.$t('common.status_detail.delivered_crypto'),
        [ORDER_STATUS.COMPLETED]: this.$t('common.status_detail.complete'),
        [ORDER_STATUS.CANCELLED]: this.$t('common.status_detail.cancelled')
      }[this.status]
    },
    statusBuyOrderText () {
      return {
        [ORDER_STATUS.TO_BE_PAID]: this.$t('common.status_detail.undelivered_fiat'),
        [ORDER_STATUS.CONFIRM_PAID]: this.$t('common.status_detail.delivered_fiat'),
        [ORDER_STATUS.PAID]: this.$t('common.status_detail.delivered_fiat'),
        [ORDER_STATUS.COMPLETED]: this.$t('common.status_detail.complete'),
        [ORDER_STATUS.CANCELLED]: this.$t('common.status_detail.cancelled')
      }[this.status]
    },
    statusClass () {
      const status = this.order.status
      if ([ORDER_STATUS.TO_BE_PAID, ORDER_STATUS.CONFIRM_PAID].includes(status)) {
        return 'is-orange'
      }
      if (ORDER_STATUS.PAID === status) {
        return 'is-blue'
      }
      if (ORDER_STATUS.COMPLETED === status) {
        return 'is-green'
      }
      return 'is-grey'
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/status-label.scss">
</style>
