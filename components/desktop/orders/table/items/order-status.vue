<template>
  <div class="order-status">
    <div class="order-status__inner">
      <div class="order-status__title">
        {{ statusText }}
      </div>
      <div v-if="subStatus" class="order-status__title order-status__title--text-color">
        {{ subStatus }}
      </div>
    </div>
  </div>
</template>
<script>
import { ORDER_STATUS } from '@/config/constant'
import { BUY_ORDER_STEPS, SELL_ORDER_STEPS } from '@/constants/orders'

export default {
  props: {
    order: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    statusText () {
      const status = this.order?.status || ''
      return status ? this.$t(`merchant.order-status.${status.toLowerCase()}`) : '';
    },
    step () {
      return this.order.step
    },
    subStatus () {
      if (this.order?.status === ORDER_STATUS.CANCELLED) {
        if (this.step === SELL_ORDER_STEPS.SELL_ORDER_CANCELLED_BY_USER) {
          return this.$t('merchant.order-step.buyer-cancel')
        } else if (this.step === BUY_ORDER_STEPS.BUY_ORDER_CANCELLED_BY_USER) {
          return this.$t('merchant.order-step.seller-cancel')
        } else {
          return this.$t('merchant.order-step.cancel-by-system')
        }
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-status.scss">
</style>
