<template>
  <div class="order-description">
    <div class="order-description__container">
      <div class="order-description__content">
        <p class="order-description__text">
          <template v-if="isCancelledOrder">
            <template v-if="isCancelByUser">
              Bạn đã <span class="cancel">hủy giao dịch</span>
            </template>
            <template v-else>
              Giao dịch <span class="cancel">bị hủy bởi hệ thống</span>
            </template>
          </template>
          <template v-else>
            Giao dịch <span class="complete">Hoàn tất</span>
          </template>
        </p>
      </div>
      <div class="order-description__thumb">
        <img :src="imageSrc" alt="Order Detail">
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
    isCancelledOrder () {
      return this.order?.status === ORDER_STATUS.CANCELLED
    },
    isCancelByUser () {
      return this.isCancelledOrder &&
      [BUY_ORDER_STEPS.BUY_ORDER_CANCELLED_BY_USER,
        SELL_ORDER_STEPS.SELL_ORDER_CANCELLED_BY_USER]
        .includes(this.order?.step)
    },
    imageSrc () {
      return this.isCancelledOrder ? '/assets/images/common/orders/order-cancelled.svg'
        : '/assets/images/common/orders/order-completed.svg'
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/order-description-header/index.scss">
</style>
