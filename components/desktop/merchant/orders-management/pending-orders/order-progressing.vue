<template>
  <div class="order-progressing">
    <progressing-countdown
      :is-visible-time-out="isVisibleTimeOut"
      :text="descriptionMerchant"
      :time-out="timeoutMilliseconds"
      :pause-countdown="isPauseCountdown"
      :is-warning="isWarningTimeOut"
      is-vertical
      @time-out="onTimeout"
    >
      <status-appeal v-if="isVisibleStatusAppeal" :order="order" />
    </progressing-countdown>
  </div>
</template>
<script>
import orderActionTransferMixin from '~/mixins/merchant/orders/action-transfer'

export default {
  components: {
    ProgressingCountdown: () => import('~/components/desktop/orders/progressing-countdown/index.vue'),
    StatusAppeal: () => import('~/components/desktop/merchant/orders-management/status-appeal.vue')
  },
  mixins: [orderActionTransferMixin],
  props: {
    order: {
      type: Object,
      default: () => {}
    },
    isVisibleStatusAppeal: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped src="static/assets/scss/components/desktop/orders/table/items/order-progressing.scss">
</style>
